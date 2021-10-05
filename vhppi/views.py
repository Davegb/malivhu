from django.http.response import JsonResponse
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.utils import timezone

from Bio import SeqIO
from io import StringIO
import re, string
import subprocess
import os

pattern = re.compile('[\W_]+')
platform = "Windows"
# platform = "Linux"

def submit(request):
    jobid = ""
    if request.method =='POST':
        p1 = True if request.POST.get("chkPhase1", False) else False
        p2 = True if request.POST.get("chkPhase2", False) else False
        p3 = True if request.POST.get("chkPhase3", False) else False
        p4 = True if request.POST.get("chkPhase4", False) else False
        email = request.POST["txtEmail"]
        if email == "":
            email = "EMPTY"
        predictVirus = request.POST.get("virus", "None")
        virusFile = True
        humanFile = True
        if request.FILES.get('fileVirusFasta', False):
            f = request.FILES['fileVirusFasta']
            seqV = f.read().decode('utf-8')
        else:
            virusFile = False
            seqV = request.POST["txtVirusFasta"]
        if p4 or predictVirus != "None":
            if request.FILES.get('fileHumanFasta', False):
                f = request.FILES['fileHumanFasta']
                seqH = f.read().decode('utf-8')
            else:
                humanFile = False
                seqH = request.POST["txtHumanFasta"]
        seqsV = toFasta(seqV)
        if len(seqsV) == 0:
            return render(request, 'vhppi/submit.html', {"jobid": "The virus sequence is not in FASTA format.", "virus": "" if virusFile else seqV, "human": "" if humanFile else seqH})
        shortSeqs = checkLength(seqsV)
        if len(shortSeqs) > 0:
            return render(request, 'vhppi/submit.html', {"jobid": "The following virus sequences are shorter than 31 accepted characters: " + ",".join(shortSeqs), "virus": "" if virusFile else seqV, "human": "" if humanFile else seqH})
        if p4 or predictVirus != "None":
            seqsH = toFasta(seqH)
            if len(seqsH) == 0:
                return render(request, 'vhppi/submit.html', {"jobid": "The human sequence is not in FASTA format.", "virus": "" if virusFile else seqV, "human": "" if humanFile else seqH})
            shortSeqs = checkLength(seqsH)
            if len(shortSeqs) > 0:
                return render(request, 'vhppi/submit.html', {"jobid": "The following human sequences are shorter than 31 accepted characters: " + ",".join(shortSeqs), "virus": "" if virusFile else seqV, "human": "" if humanFile else seqH})

        p = executeCommand("ssh dguevara@biocluster.usu.edu \"sbatch -J job -o job.out -e job.err --cpus-per-task 1 --ntasks 1 -t 7-0:00 --mem=2000 --partition guru --wrap=''\"")
        if p.startswith("Submitted"):
            jobid = p.split()[3]
        
        p = executeCommand("ssh dguevara@biocluster.usu.edu \"mkdir VirusProteins/webserver/files/" + jobid + "\"")
        if p != "":
            return render(request, 'vhppi/submit.html', {"jobid": "There was an error trying to submit your job. Please, try again later or contact us.", "virus": "", "human": ""})
        p = executeCommand("ssh dguevara@biocluster.usu.edu \"echo '" + seqV + "' > VirusProteins/webserver/files/" + jobid + "/virus.fasta\"")
        if p != "":
            return render(request, 'vhppi/submit.html', {"jobid": "There was an error trying to submit your job. Please, try again later or contact us.", "virus": "", "human": ""})
        if p4 or predictVirus != "None":
            p = executeCommand("ssh dguevara@biocluster.usu.edu \"echo '" + seqH + "' > VirusProteins/webserver/files/" + jobid + "/human.fasta\"")
            if p != "":
                return render(request, 'vhppi/submit.html', {"jobid": "There was an error trying to submit your job. Please, try again later or contact us.", "virus": "", "human": ""})
        
        command = "ssh dguevara@biocluster.usu.edu \"cd ~/VirusProteins/webserver && sbatch -J " + jobid + "/predict -o ./files/" + jobid + "/predict.out -e ./files/" + jobid + "/predict.err --requeue --mem=48000 --nodes=1 --cpus-per-task 1 --ntasks=1 --mail-type=FAIL,BEGIN,END --mail-user=davguev@aggiemail.usu.edu --gres=gpu:tesla:1 --nodelist chela-g01 -t 3-0:00 --partition mahaguru --wrap='module load anaconda3/6_2020.11 ; source /opt/software/anaconda3/2020.11/anaconda/bin/activate tf ; python3 -u predictWeb.py " + str(p1) + " " + str(p2) + " " + str(p3) + " " + str(p4) + " " + predictVirus + " " + jobid + " " + email + " > files/" + jobid + "/predict.py.out'\""
        print(command)
        p = executeCommand(command)
        if not p.startswith("Submitted"):
            return render(request, 'vhppi/submit.html', {"jobid": "There was an error trying to submit your job. Please, try again later or contact us.", "virus": "", "human": ""})
        return render(request, 'vhppi/submit.html', {"jobid": 'Your job has been submitted! Please, check the following link to check the results. <a href="http://127.0.0.1:8000/vhppi/' + jobid + '" target="_blank">http://127.0.0.1:8000/vhppi/' + jobid + "</a>", "virus": "", "human": ""})
    return render(request, 'vhppi/submit.html', {"jobid": "", "virus": "", "human": ""})

def submitPhase4(request, jobId):
    if request.method =='POST':
        if request.FILES.get('file', False):
            f = request.FILES['file']
            seqH = f.read().decode('utf-8')
        else:
            seqH = request.POST["text"]
        print(seqH)
        seqsH = toFasta(seqH)
        if len(seqsH) == 0:
            return HttpResponse("The human sequence is not in FASTA format.")
        shortSeqs = checkLength(seqsH)
        if len(shortSeqs) > 0:
            return HttpResponse("The following human sequences are shorter than 31 accepted characters: " + ",".join(shortSeqs))
        p = executeCommand("ssh dguevara@biocluster.usu.edu \"echo '" + seqH + "' > VirusProteins/webserver/files/" + str(jobId) + "/human.fasta\"")
        if p != "":
            return HttpResponse("There was an error trying to submit your job. Please, try again later or contact us.")
        command = "ssh dguevara@biocluster.usu.edu \"cd ~/VirusProteins/webserver && sbatch -J " + str(jobId) + "/predictP4 -o ./files/" + str(jobId) + "/predictP4.out -e ./files/" + str(jobId) + "/predictP4.err --requeue --mem=48000 --nodes=1 --cpus-per-task 1 --ntasks=1 --mail-type=FAIL,BEGIN,END --mail-user=davguev@aggiemail.usu.edu --gres=gpu:tesla:1 --nodelist chela-g01 -t 3-0:00 --partition mahaguru --wrap='module load anaconda3/6_2020.11 ; source /opt/software/anaconda3/2020.11/anaconda/bin/activate tf ; python3 -u predictPhase4.py " + str(jobId) + " > files/" + str(jobId) + "/predictP4.py.out'\""
        p = executeCommand(command)
        if not p.startswith("Submitted"):
            return HttpResponse("There was an error trying to submit your job. Please, try again later or contact us.")
        return HttpResponse("Your interactions are being predicted.")

def results(request, jobId):
    phase1 = ""
    info1 = ""
    phase2 = ""
    info2 = ""
    phase3 = ""
    info3 = ""
    phase4 = ""
    info4 = ""
    if "runP2" in request.POST:
        p = executeCommand("ssh dguevara@biocluster.usu.edu \"echo \"DONE\" > ./VirusProteins/webserver/files/" + str(jobId) + "/predictP2.out \"")
        if p != "":
            info2 = "There was an error trying to run phase 2."
            return render(request, 'vhppi/results.html', {"jobId": jobId, 'phase1': phase1, 'phase2': phase2, 'phase3': phase3, 'phase4': phase4,   
                'info1': info1, 'info2': info2, 'info3': info3, 'info4': info4})
        info2 = "ACTIVE"
    elif "runP3" in request.POST:
        p = executeCommand("ssh dguevara@biocluster.usu.edu \"echo \"DONE\" > ./VirusProteins/webserver/files/" + str(jobId) + "/predictP3.out \"")
        if p != "":
            info3 = "There was an error trying to run phase 3."
            return render(request, 'vhppi/results.html', {"jobId": jobId, 'phase1': phase1, 'phase2': phase2, 'phase3': phase3, 'phase4': phase4,   
                'info1': info1, 'info2': info2, 'info3': info3, 'info4': info4})
        info3 = "ACTIVE"
    elif "runP4" in request.POST:
        p = executeCommand("ssh dguevara@biocluster.usu.edu \"echo \"DONE\" > ./VirusProteins/webserver/files/" + str(jobId) + "/predictP4.out \"")
        if p != "":
            info4 = "There was an error trying to run phase 4."
            return render(request, 'vhppi/results.html', {"jobId": jobId, 'phase1': phase1, 'phase2': phase2, 'phase3': phase3, 'phase4': phase4,   
                'info1': info1, 'info2': info2, 'info3': info3, 'info4': info4})
        info4 = "ACTIVE"

    # Get structure prediction status
    p = executeCommand("ssh dguevara@biocluster.usu.edu \"cat ./VirusProteins/webserver/files/" + str(jobId) + "/virusPsipred.out ; cat ./VirusProteins/webserver/files/" + str(jobId) + "/humanPsipred.out\"")
    structures = p.split("\n")

    # Get phases status
    p = executeCommand("ssh dguevara@biocluster.usu.edu \"cat ./VirusProteins/webserver/files/" + str(jobId) + "/predictP1.out ; echo '' ; cat ./VirusProteins/webserver/files/" + str(jobId) + "/predictP2.out ; echo '' ; cat ./VirusProteins/webserver/files/" + str(jobId) + "/predictP3.out ; echo '' ; cat ./VirusProteins/webserver/files/" + str(jobId) + "/predictP4.out \"")
    phases = p.split("\n")
    phases = list(filter(None, phases))
    
    # Get phase 1 data
    if phases[0].strip() == "YES":
        info1 = "Please, try reloading the page in a minute. Your results will be available soon."
    elif phases[0].strip() == "NO":
        info1 = "Phase 1 was not selected for execution."
    elif phases[0].strip() == "DONE":
        p = executeCommand("ssh dguevara@biocluster.usu.edu cat ./VirusProteins/webserver/files/" + str(jobId) + "/phase1.out")
        phase1 = []
        lines = p.splitlines()
        for line in lines:
            proteinData = line.split()
            proteinData2 = []
            proteinData2.append(proteinData[0])
            neg = float(proteinData[1]) * 100
            pos = float(proteinData[2]) * 100
            if(neg > pos):
                proteinData2.append("Non-ssRNA(-)")
            else:
                proteinData2.append("ssRNA(-)")
            proteinData2.append(str(round(pos, 2)) + "%")
            proteinData2.append(str(round(neg, 2)) + "%")
            phase1.append(proteinData2)
    # Get phase 2 data
    if phases[1].strip() == "YES":
        info2 = "Please, try reloading the page in a minute. Your results will be available soon."
    elif phases[1].strip() == "NO":
        info2 = "Phase 2 was not selected for execution."
    elif phases[1].strip() == "DONE":
        p = executeCommand("ssh dguevara@biocluster.usu.edu cat ./VirusProteins/webserver/files/" + str(jobId) + "/phase2.out")
        phase2 = []
        lines = p.splitlines()
        for line in lines:
            proteinData = line.split()
            proteinData2 = []
            proteinData2.append(proteinData[0])
            neg = float(proteinData[1]) * 100
            pos = float(proteinData[2]) * 100
            if(neg > pos):
                proteinData2.append("Non-Coronaviridae")
            else:
                proteinData2.append("Coronaviridae")
            proteinData2.append(str(round(pos, 2)) + "%")
            proteinData2.append(str(round(neg, 2)) + "%")
            phase2.append(proteinData2)
    # Get phase 3 data
    if phases[2].strip() == "YES":
        info3 = "Please, try reloading the page in a minute. Your results will be available soon."
    elif phases[2].strip() == "NO":
        info3 = "Phase 3 was not selected for execution."
    elif phases[2].strip() == "DONE":
        p = executeCommand("ssh dguevara@biocluster.usu.edu cat ./VirusProteins/webserver/files/" + str(jobId) + "/phase3.out")
        phase3 = []
        lines = p.splitlines()
        for line in lines:
            proteinData = line.split()
            proteinData2 = []
            proteinData2.append(proteinData[0])
            neg = float(proteinData[1]) * 100
            sars = float(proteinData[2]) * 100
            mers = float(proteinData[3]) * 100
            if(neg > sars and neg > mers):
                proteinData2.append("Other Coronaviridae")
            elif(sars > mers):
                proteinData2.append("SARS")
            else:
                proteinData2.append("MERS")
            proteinData2.append(str(round(sars, 2)) + "%")
            proteinData2.append(str(round(mers, 2)) + "%")
            proteinData2.append(str(round(neg, 2)) + "%")
            phase3.append(proteinData2)
    # Get phase 4 data
    if phases[3].strip() == "YES":
        info4 = "Please, try reloading the page in a minute. Your results will be available soon."
    elif phases[3].strip() == "NO":
        info4 = "Phase 4 was not selected for execution."
    elif phases[3].strip() == "DONE":
        p = executeCommand("ssh dguevara@biocluster.usu.edu cat ./VirusProteins/webserver/files/" + str(jobId) + "/phase4.out")
        phase4 = []
        lines = p.splitlines()
        for line in lines:
            proteinData = line.split()
            proteinData2 = []
            interaction = proteinData[0].split("___")
            proteinData2.append(interaction[0])
            proteinData2.append(proteinData[1])
            proteinData2.append(interaction[1])
            pos = float(proteinData[3]) * 100
            neg = float(proteinData[2]) * 100
            if(neg > pos):
                proteinData2.append("No")
            else:
                proteinData2.append("Yes")
            proteinData2.append(str(round(pos, 2)) + "%")
            proteinData2.append(str(round(neg, 2)) + "%") 
            phase4.append(proteinData2)
    return render(request, 'vhppi/results.html', {"jobId": jobId, 'phase1': phase1, 'phase2': phase2, 'phase3': phase3, 'phase4': phase4,   
                'info1': info1, 'info2': info2, 'info3': info3, 'info4': info4, "structures": structures})

def predictSecondary(request, jobId):
    if request.method == "POST" and request.is_ajax:
        protein = request.body.decode('utf-8')
        command = "cd ~/VirusProteins/webserver/files/" + str(jobId) + "/ && sbatch -J " + str(jobId) + "/" + protein + " -o ./" + protein + ".out -e ./" + protein + ".err --mem=48000 --nodes=1 --cpus-per-task 20 --ntasks=1 -t 3-0:00 --partition guru --wrap='python3 ../../runPsipred.py " + str(jobId) + " " + protein + "'"
        print(command)
        p = executeCommand("ssh dguevara@biocluster.usu.edu \"" + command+ "\"")
        return HttpResponse(p)
    return HttpResponse("")

def predictTertiary(request, jobId, protein):
    return render(request, 'vhppi/tertiaryStructure.html', {'structure': "A"})

def secondaryStructure(request, jobId, protein):
    splits = protein.split("_")
    protein = pattern.sub('', splits[1])
    protein = splits[0] + "_" + protein
    p = executeCommand("ssh dguevara@biocluster.usu.edu cat ./VirusProteins/webserver/files/" + str(jobId) + "/" + protein + ".horiz")
    print("ssh dguevara@biocluster.usu.edu cat ./VirusProteins/webserver/files/" + str(jobId) + "/" + protein + ".horiz")
    if(p.strip() == "YES"):
        p = "There is no structure predicted for this protein yet. Check again later!"
    elif(p.strip() == "NO"):
        p = "Sorry! That protein is not listed in your submission."
    elif(p.strip() == ""):
        p = "Sorry! There was an error trying to find your protein."
    return render(request, 'vhppi/secondaryStructure.html', {'structure': p})

def tertiaryStructure(request, jobId, protein):
    protein = pattern.sub('', protein)
    p = executeCommand("ssh dguevara@biocluster.usu.edu cat ./VirusProteins/webserver/files/" + str(jobId) + "/" + protein + ".horiz")
    if(p.strip() == "YES"):
        p = "There is no structure predicted for this protein yet. Check again later!"
    elif(p.strip() == ""):
        p = "Sorry! That protein is not listed in your submission."
    return render(request, 'vhppi/tertiaryStructure.html', {'structure': p})

def checkProgress(request, jobId):
    p = executeCommand("ssh dguevara@biocluster.usu.edu \"cat ./VirusProteins/webserver/files/" + str(jobId) + "/virusPsipred.out ; cat ./VirusProteins/webserver/files/" + str(jobId) + "/humanPsipred.out ; \"")
    return HttpResponse(p)

def about(request):
    return render(request, 'vhppi/about.html', {})

def help(request):
    return render(request, 'vhppi/help.html', {})

def toFasta(str):
    io = StringIO(str)
    seqs = SeqIO.parse(io, "fasta")
    return list(seqs)

def checkLength(seqs):
    shortSeqs = []
    for rec in seqs:
        read = re.sub('[^ARNDCQEGHILKMFPSTWYV]', '', ''.join(str(rec.seq)).upper())
        if len(read) < 31:
            shortSeqs.append(rec.name)
    return shortSeqs

def executeCommand(command):
    if platform != "Windows":
        p = subprocess.getoutput(command)
        return p
    else:
        p = subprocess.run(["C:/Program Files/Git/bin/bash.exe", "-c", command], capture_output=True)
        return p.stdout.decode("utf-8")