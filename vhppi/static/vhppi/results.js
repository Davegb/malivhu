var jobIds = window.location.href.split("/");
for (let i = jobIds.length - 1; i >= 0; i--) {
    var jobId = jobIds[i].trim();
    if(jobId !== ""){
        break;
    }
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

function checkHumanFasta() {
    var textareaText = $('#txtHumanFasta').val();
    var data = new FormData();
    jQuery.each(jQuery('#fileHumanFasta')[0].files, function(i, file) {
        data.append("file", file);
    });
    data.append("text", textareaText);
    $.ajax({
        method: 'POST',
        url: window.location.href + "/submitPhase4",
        headers: {'X-CSRFToken': csrftoken},
        contentType: false,
        processData: false,
        cache: false,
        data: data,
        success: function(data) {
            if(data !== "Your interactions are being predicted. Please, reload the page in a minute."){
                alert(data);
                setTimeout(() => { $('#modalHuman').modal('toggle');}, 300);
            } else {
                document.getElementById("phase4Info").innerText = data;
                setTimeout(() => { $('#modalSubmission').modal('toggle');}, 300);
            }
        }, 
        error: function(data) {
            document.getElementById("phase4Info").innerText = "There was an error submitting your job. " + data;
        }
    });
}

function fillHuman(){
    $("#txtHumanFasta").val(">Q00266\n" +
    "MNGPVDGLCDHSLSEGVFMFTSESVGEGHPDKICDQISDAVLDAHLKQDPNAKVACETVCKTGMVLLCGEITSMAMVDYQRVVRDTIKHIGYDDSAKGFDFKTCNVLVALEQQSPDIAQCVHLDRNEEDVGAGDQGLMFGYATDETEECMPLTIILAHKLNARMADLRRSGLLPWLRPDSKTQVTVQYMQDNGAVIPVRIHTIVISVQHNEDITLEEMRRALKEQVIRAVVPAKYLDEDTVYHLQPSGRFVIGGPQGDAGVTGRKIIVDTYGGWGAHGGGAFSGKDYTKVDRSAAYAARWVAKSLVKAGLCRRVLVQVSYAIGVAEPLSISIFTYGTSQKTERELLDVVHKNFDLRPGVIVRDLDLKKPIYQKTACYGHFGRSEFPWEVPRKLVF\n" +
    ">Q8NB16\n" +
    "MENLKHIITLGQVIHKRCEEMKYCKKQCRRLGHRVLGLIKPLEMLQDQGKRSVPSEKLTTAMNRFKAALEEANGEIEKFSNRSNICRFLTASQDKILFKDVNRKLSDVWKELSLLLQVEQRMPVSPISQGASWAQEDQQDADEDRRAFQMLRRDNEKIEASLRRLEINMKEIKETLRQYLPPKCMQEIPQEQIKEIKKEQLSGSPWILLRENEVSTLYKGEYHRAPVAIKVFKKLQAGSIAIVRQTFNKEIKTMKKFESPNILRIFGICIDETVTPPQFSIVMEYCELGTLRELLDREKDLTLGKRMVLVLGAARGLYRLHHSEAPELHGKIRSSNFLVTQGYQVKLAGFELRKTQTSMSLGTTREKTDRVKSTAYLSPQELEDVFYQYDVKSEIYSFGIVLWEIATGDIPFQGCNSEKIRKLVAVKRQQEPLGEDCPSELREIIDECRAHDPSVRPSVDEILKKLSTFSK\n" +
    ">O94851\n" +
    "MGENEDEKQAQAGQVFENFVQASTCKGTLQAFNILTRHLDLDPLDHRNFYSKLKSKVTTWKAKALWYKLDKRGSHKEYKRGKSCTNTKCLIVGGGPCGLRTAIELAYLGAKVVVVEKRDSFSRNNVLHLWPFTIHDLRGLGAKKFYGKFCAGSIDHISIRQLQLILFKVALMLGVEIHVNVEFVKVLEPPEDQENQKIGWRAEFLPTDHSLSEFEFDVIIGADGRRNTLEGFRRKEFRGKLAIAITANFINRNSTAEAKVEEISGVAFIFNQKFFQDLKEETGIDLENIVYYKDCTHYFVMTAKKQSLLDKGVIINDYIDTEMLLCAENVNQDNLLSYAREAADFATNYQLPSLDFAMNHYGQPDVAMFDFTCMYASENAALVRERQAHQLLVALVGDSLLEPFWPMGTGCARGFLAAFDTAWMVKSWNQGTPPLELLAERESLYRLLPQTTPENINKNFEQYTLDPGTRYPNLNSHCVRPHQVKHLYITKELEHYPLERLGSVRRSVNLSRKESDIRPSKLLTWCQQQTEGYQHVNVTDLTTSWRSGLALCAIIHRFRPELINFDSLNEDDAVENNQLAFDVAEREFGIPPVTTGKEMASAQEPDKLSMVMYLSKFYELFRGTPLRPVDSWRKNYGENADLSLAKSSISNNYLNLTFPRKRTPRVDGQTGENDMNKRRRKGFTNLDEPSNFSSRSLGSNQECGSSKEGGNQNKVKSMANQLLAKFEESTRNPSLMKQERRVSGIGKPVLCSSSGPPVHSCCPKPEEATPSPSPPLKRQFPSVVVTGHVLRELKQVSAGSECLSRPWRARAKSDLQLGGTENFATLPSTRPRAQALSGVLWRLQQVEEKILQKRAQNLANREFHTKNIKEKAAHLASMFGHGDFPQNKLLSKGLSHTHPPSPPSRLPSPDPAASSSPSTVDSASPARKEKKSPSGFHFHPSHLRTVHPQLTVGKVSSGIGAAAEVLVNLYMNDHRPKAQATSPDLESMRKSFPLNLGGSDTCYFCKKRVYVMERLSAEGHFFHRECFRCSICATTLRLAAYTFDCDEGKFYCKPHFIHCKTNSKQRKRRAELKQQREEEATWQEQEAPRRDTPTESSCAVAAIGTLEGSPPVHFSLPVLHPLLG\n" +
    ">Q8TDZ2\n" +
    "MASPTSTNPAHAHFESFLQAQLCQDVLSSFQELCGALGLEPGGGLPQYHKIKDQLNYWSAKSLWTKLDKRAGQPVYQQGRACTSTKCLVVGAGPCGLRVAVELALLGARVVLVEKRTKFSRHNVLHLWPFTIHDLRALGAKKFYGRFCTGTLDHISIRQLQLLLLKVALLLGVEIHWGVTFTGLQPPPRKGSGWRAQLQPNPPAQLANYEFDVLISAAGGKFVPEGFKVREMRGKLAIGITANFVNGRTVEETQVPEISGVARIYNQSFFQSLLKATGIDLENIVYYKDDTHYFVMTAKKQCLLRLGVLRQDWPDTNRLLGSANVVPEALQRFTRAAADFATHGKLGKLEFAQDAHGQPDVSAFDFTSMMRAESSARVQEKHGARLLLGLVGDCLVEPFWPLGTGVARGFLAAFDAAWMVKRWAEGAESLEVLAERESLYQLLSQTSPENMHRNVAQYGLDPATRYPNLNLRAVTPNQVRDLYDVLAKEPVQRNNDKTDTGMPATGSAGTQEELLRWCQEQTAGYPGVHVSDLSSSWADGLALCALVYRLQPGLLEPSELQGLGALEATAWALKVAENELGITPVVSAQAVVAGSDPLGLIAYLSHFHSAFKSMAHSPGPVSQASPGTSSAVLFLSKLQRTLQRSRAKENAEDAGGKKLRLEMEAETPSTEVPPDPEPGVPLTPPSQHQEAGAGDLCALCGEHLYVLERLCVNGHFFHRSCFRCHTCEATLWPGGYEQHPGDGHFYCLQHLPQTDHKAEGSDRGPESPELPTPSENSMPPGLSTPTASQEGAGPVPDPSQPTRRQIRLSSPERQRLSSLNLTPDPEMEPPPKPPRSCSALARHALESSFVGWGLPVQSPQALVAMEKEEKESPFSSEEEEEDVPLDSDVEQALQTFAKTSGTMNNYPTWRRTLLRRAKEEEMKRFCKAQTIQRRLNEIEAALRELEAEGVKLELALRRQSSSPEQQKKLWVGQLLQLVDKKNSLVAEEAELMITVQELNLEEKQWQLDQELRGYMNREENLKTAADRQAEDQVLRKLVDLVNQRDALIRFQEERRLSELALGTGAQG\n" +
    ">Q9NPJ6\n" +
    "MAASSSGEKEKERLGGGLGVAGGNSTRERLLSALEDLEVLSRELIEMLAISRNQKLLQAGEENQVLELLIHRDGEFQELMKLALNQGKIHHEMQVLEKEVEKRDSDIQQLQKQLKEAEQILATAVYQAKEKLKSIEKARKGAISSEEIIKYAHRISASNAVCAPLTWVPGDPRRPYPTDLEMRSGLLGQMNNPSTNGVNGHLPGDALAAGRLPDVLAPQYPWQSNDMSMNMLPPNHSSDFLLEPPGHNKENEDDVEIMSTDSSSSSSESD\n" +
    ">Q8N635\n" +
    "MANSFAARIFTTLSDLQTNMANLKVIGIVIGKTDVKGFPDRKNIGSERYTFSFTIRDSPAHFVNAASWGNEDYIKSLSDSFRVGDCVIIENPLIQRKEIEREEKFSPATPSNCKLLLSENHSTVKVCSSYEVDTKLLSLIHLPVKESHDYYSLGDIVANGHSLNGRIINVLAAVKSVGEPKYFTTSDRRKGQRCEVRLYDETESSFAMTCWDNESILLAQSWMPRETVIFASDVRINFDKFRNCMTATVISKTIITTNPDIPEANILLNFIRENKETNVLDDEIDSYFKESINLSTIVDVYTVEQLKGKALKNEGKADPSYGILYAYISTLNIDDETTKVVRNRCSSCGYIVNEASNMCTTCNKNSLDFKSVFLSFHVLIDLTDHTGTLHSCSLTGSVAEETLGCTFVLSHRARSGLKISVLSCKLADPTEASRNLSGQKHV\n" +
    ">O15553\n" +
    "MAKTPSDHLLSTLEELVPYDFEKFKFKLQNTSVQKEHSRIPRSQIQRARPVKMATLLVTYYGEEYAVQLTLQVLRAINQRLLAEELHRAAIQEYSTQENGTDDSAASSSLGENKPRSLKTPDHPEGNEGNGPRPYGGGAASLRCSQPEAGRGLSRKPLSKRREKASEGLDAQGKPRTRSPALPGGRSPGPCRALEGGQAEVRLRRNASSAGRLQGLAGGAPGQKECRPFEVYLPSGKMRPRSLEVTISTGEKAPANPEILLTLEEKTAANLDSATEPRARPTPDGGASADLKEGPGNPEHSVTGRPPDTAASPRCHAQEGDPVDGTCVRDSCSFPEAVSGHPQASGSRSPGCPRCQDSHERKSPGSLSPQPLPQCKRHLKQVQLLFCEDHDEPICLICSLSQEHQGHRVRPIEEVALEHKKKIQKQLEHLKKLRKSGEEQRSYGEEKAVSFLKQTEALKQRVQRKLEQVYYFLEQQEHFFVASLEDVGQMVGQIRKAYDTRVSQDIALLDALIGELEAKECQSEWELLQDIGDILHRAKTVPVPEKWTTPQEIKQKIQLLHQKSEFVEKSTKYFSETLRSEMEMFNVPELIGAQAHAVNVILDAETAYPNLIFSDDLKSVRLGNKWERLPDGPQRFDSCIIVLGSPSFLSGRRYWEVEVGDKTAWILGACKTSISRKGNMTLSPENGYWVVIMMKENEYQASSVPPTRLLIKEPPKRVGIFVDYRVGSISFYNVTARSHIYTFASCSFSGPLQPIFSPGTRDGGKNTAPLTICPVGGQGPD\n" +
    ">Q8NCK7\n" +
    "MPAPQRKHRRGGFSHRCFPTPQTAMTPQPAGPPDGGWGWVVAAAAFAINGLSYGLLRSLGLAFPDLAEHFDRSAQDTAWISALALAVQQAASPVGSALSTRWGARPVVMVGGVLASLGFVFSAFASDLLHLYLGLGLLAGFGWALVFAPALGTLSRYFSRRRVLAVGLALTGNGASSLLLAPALQLLLDTFGWRGALLLLGAITLHLTPCGALLLPLVLPGDPPAPPRSPLAALGLSLFTRRAFSIFALGTALVGGGYFVPYVHLAPHALDRGLGGYGAALVVAVAAMGDAGARLVCGWLADQGWVPLPRLLAVFGALTGLGLWVVGLVPVVGGEESWGGPLLAAAVAYGLSAGSYAPLVFGVLPGLVGVGGVVQATGLVMMLMSLGGLLGPPLSGFLRDETGDFTASFLLSGSLILSGSFIYIGLPRALPSCGPASPPATPPPETGELLPAPQAVLLSPGGPGSTLDTTC\n" +
    ">Q9HD23\n" +
    "MECLRSLPCLLPRAMRLPRRTLCALALDVTSVGPPVAACGRRANLIGRSRAAQLCGPDRLRVAGEVHRFRTSDVSQATLASVAPVFTVTKFDKQGNVTSFERKKTELYQELGLQARDLRFQHVMSITVRNNRIIMRMEYLKAVITPECLLILDYRNLNLEQWLFRELPSQLSGEGQLVTYPLPFEFRAIEALLQYWINTLQGKLSILQPLILETLDALVDPKHSSVDRSKLHILLQNGKSLSELETDIKIFKESILEILDEEELLEELCVSKWSDPQVFEKSSAGIDHAEEMELLLENYYRLADDLSNAARELRVLIDDSQSIIFINLDSHRNVMMRLNLQLTMGTFSLSLFGLMGVAFGMNLESSLEEDHRIFWLITGIMFMGSGLIWRRLLSFLGRQLEAPLPPMMASLPKKTLLADRSMELKNSLRLDGLGSGRSILTNR");
    var textareaText = $('#txtHumanFasta').val();
    textareaText = textareaText.replace(/\r?\n/g, '<br />');
    $('#txtHumanFasta').html(textareaText);
}

function predictSecondary(protein){
    $.ajax({
        method: 'POST',
        url: window.location.href + "/predict/2",
        headers: {'X-CSRFToken': csrftoken},
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        cache: false,
        data: protein,
        success: function(data) {
            console.log(data);
        }, 
        error: function(data) {
            console.log("NOT SENT");
        }
    }).done(function() {
        $( this ).addClass( "done" );
    });
}
$(document).ready(function() {
    document.getElementById('myTabContent').style.display = "";
    while(document.getElementById('phase1-data') === null){
        //DO NOTHING
    }
    value = JSON.parse(document.getElementById('phase1-data').text);
    console.log(value);
    var dataSet1 = value;
    if (dataSet1){
        document.getElementById('phase1-tab').style.display = "";
    }

    while(document.getElementById('phase2-data') === null){
        //DO NOTHING
    }
    value = JSON.parse(document.getElementById('phase2-data').text);
    console.log(value);
    var dataSet2 = value;
    if (dataSet2){
        document.getElementById('phase2-tab').style.display = "";
    } 

    while(document.getElementById('phase3-data') === null){
        //DO NOTHING
    }
    value = JSON.parse(document.getElementById('phase3-data').text);
    console.log(value);
    var dataSet3 = value;
    if (dataSet3){
        document.getElementById('phase3-tab').style.display = "";
    } 

    while(document.getElementById('phase4-data') === null){
        //DO NOTHING
    }
    value = JSON.parse(document.getElementById('phase4-data').text);
    console.log(value);
    var dataSet4 = value;
    if (dataSet4){
        document.getElementById('phase4-tab').style.display = "";
    } 

    while(document.getElementById('info1-data') === null){
        //DO NOTHING
    }
    value = JSON.parse(document.getElementById('info1-data').text);
    if (value === ""){
        document.getElementById('tabPhase1').style.display = "";
        if (!dataSet2) {
            document.getElementById("formRunP2").style.display = "";
        }
    } 

    while(document.getElementById('info2-data') === null){
        //DO NOTHING
    }
    value = JSON.parse(document.getElementById('info2-data').text);
    if (value === ""){
        document.getElementById('tabPhase2').style.display = "";
        if (!dataSet3) {
            document.getElementById("formRunP3").style.display = "";
        }
    }

    while(document.getElementById('info3-data') === null){
        //DO NOTHING
    }
    value = JSON.parse(document.getElementById('info3-data').text);
    if (value === ""){
        document.getElementById('tabPhase3').style.display = "";
        if (!dataSet4) {
            document.getElementById("btnRunPhase4").style.display = "";
        }
    }

    while(document.getElementById('info4-data') === null){
        //DO NOTHING
    }
    value = JSON.parse(document.getElementById('info4-data').text);
    if (value === ""){
        document.getElementById('tabPhase4').style.display = "";
    }

    while(document.getElementById('structures-data') === null){
        //DO NOTHING
    }
    valueStructures = document.getElementById('structures-data').text;
    valueStructuresJSON = JSON.parse(valueStructures);
    structures = {}
    for(line of valueStructuresJSON){
        splits = line.split(" ");
        structures[splits[0]] = splits[1]
    }
    console.log(structures);

    $('#tabPhase1').DataTable( {
        data: dataSet1,
        columns: [
            { title: "Protein name" },
            { title: "Prediction" },
            { title: "ssRNA(-)" },
            { title: "Non-ssRNA(-)" },
            { title: "Secondary structure" },
            { title: "Tertiary structure" },
        ], 
        dom: 'Blfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ],
        "columnDefs": [{
            "targets": -1,
            "data": null,
            "className": 'dt-body-center',
            "render": function(data, type, row){
                csrf = document.getElementById('formRunP2').children[0].outerHTML
                protein = row[0].replace(/[^0-9a-z]/gi, '');
                return "<form action=\"{% url 'predictTertiary/" + protein + "'  %}\" method=\"post\">" + csrf + "<input type=\"hidden\" name=\"hiddenProtein\" value=\"" + protein + "\"><button name=\"protein_" + protein + "\" type=\"submit\" class='btn btn-primary' onClick='this.form.submit(); this.disabled=true; this.value='Predicting...'; predictTertiary('" + protein + "');'>Predict</button></form>"
            },
        }, {
            "targets": -2,
            "data": null,
            "className": 'dt-body-center',
            "render": function(data, type, row){
                csrf = document.getElementById('formRunP2').children[0].outerHTML
                protein = row[0].replace(/[^0-9a-z]/gi, '');
                predicting = structures[protein];
                if(predicting == "NO"){
                    return "<button class='btn btn-primary' onClick='this.disabled=true; this.innerText=\"Predicting...\"; predictSecondary(\"VIRUS_" + protein + "\");'>Predict</button>"
                } else if (predicting == "YES"){
                    return "<button class='btn btn-primary' disabled>Predicting...</button>"
                } else if (predicting == "DONE"){
                    return "<form action=\"" + window.location.href + "/2/" + protein + "\" method=\"post\">" + csrf + "<button name=\"protein_" + protein + "\" type=\"submit\" class='btn btn-primary'>View</button></form>"
                }
            },
        }],
        rowCallback: function(row, data, index){
            if(data[1] == "ssRNA(-)"){
                $(row).css('background-color', '#b9e2bc');
            }
            else {
                $(row).css('background-color', '#e2b9b9');
            }
            let scorePos = parseFloat(data[2].slice(0, -1));
            let scoreNeg = parseFloat(data[3].slice(0, -1));
            if(scorePos > scoreNeg) {
                $(row).find('td:eq(2)').css('font-weight', 'bold');
            } else {
                $(row).find('td:eq(3)').css('font-weight', 'bold');
            }
        }
    } );
    $('#tabPhase2').DataTable( {
        data: dataSet2,
        columns: [
            { title: "Protein name" },
            { title: "Prediction" },
            { title: "Coronaviridae" },
            { title: "Non-Coronaviridae" },
            { title: "Secondary structure" },
            { title: "Tertiary structure" },
        ], 
        dom: 'Blfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ],
        "columnDefs": [{
            "targets": -1,
            "data": null,
            "className": 'dt-body-center',
            "render": function(data, type, row){
                csrf = document.getElementById('formRunP2').children[0].outerHTML
                protein = row[0].replace(/[^0-9a-z]/gi, '');
                return "<form action=\"{% url 'predictTertiary/" + protein + "'  %}\" method=\"post\">" + csrf + "<input type=\"hidden\" name=\"hiddenProtein\" value=\"" + protein + "\"><button name=\"protein_" + protein + "\" type=\"submit\" class='btn btn-primary' onClick='this.form.submit(); this.disabled=true; this.value='Predicting...'; predictTertiary('" + protein + "');'>Predict</button></form>"
            },
        }, {
            "targets": -2,
            "data": null,
            "className": 'dt-body-center',
            "render": function(data, type, row){
                csrf = document.getElementById('formRunP2').children[0].outerHTML
                protein = row[0].replace(/[^0-9a-z]/gi, '');
                predicting = structures[protein];
                if(predicting == "NO"){
                    return "<button class='btn btn-primary' onClick='this.disabled=true; this.innerText=\"Predicting...\"; predictSecondary(\"VIRUS_" + protein + "\");'>Predict</button>"
                } else if (predicting == "YES"){
                    return "<button class='btn btn-primary' disabled>Predicting...</button>"
                } else if (predicting == "DONE"){
                    return "<form action=\"" + window.location.href + "/2/" + protein + "\" method=\"post\">" + csrf + "<button name=\"protein_" + protein + "\" type=\"submit\" class='btn btn-primary'>View</button></form>"
                }
            },
        }],
        rowCallback: function(row, data, index){
            if(data[1] == "Coronaviridae"){
                $(row).css('background-color', '#b9e2bc');
            }
            else {
                $(row).css('background-color', '#e2b9b9');
            }
            let scorePos = parseFloat(data[2].slice(0, -1));
            let scoreNeg = parseFloat(data[3].slice(0, -1));
            if(scorePos > scoreNeg) {
                $(row).find('td:eq(2)').css('font-weight', 'bold');
            } else {
                $(row).find('td:eq(3)').css('font-weight', 'bold');
            }
        }
    } );
    $('#tabPhase3').DataTable( {
        data: dataSet3,
        columns: [
            { title: "Protein name" },
            { title: "Prediction" },
            { title: "SARS" },
            { title: "MERS" },
            { title: "Other Coronaviridae" },
            { title: "Secondary structure" },
            { title: "Tertiary structure" },
        ], 
        dom: 'Blfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ],
        "columnDefs": [{
            "targets": -1,
            "data": null,
            "className": 'dt-body-center',
            "render": function(data, type, row){
                csrf = document.getElementById('formRunP2').children[0].outerHTML
                protein = row[0].replace(/[^0-9a-z]/gi, '');
                return "<form action=" + jobIds + "'predictTertiary/" + protein + "'\" method=\"post\">" + csrf + "<input type=\"hidden\" name=\"hiddenProtein\" value=\"" + protein + "\"><button name=\"protein_" + protein + "\" type=\"submit\" class='btn btn-primary' onClick='this.form.submit(); this.disabled=true; this.value='Predicting...'; predictTertiary('" + protein + "');'>Predict</button></form>"
            },
        }, {
            "targets": -2,
            "data": null,
            "className": 'dt-body-center',
            "render": function(data, type, row){
                csrf = document.getElementById('formRunP2').children[0].outerHTML
                protein = row[0].replace(/[^0-9a-z]/gi, '');
                predicting = structures[protein];
                if(predicting == "NO"){
                    return "<button class='btn btn-primary' onClick='this.disabled=true; this.innerText=\"Predicting...\"; predictSecondary(\"VIRUS_" + protein + "\");'>Predict</button>"
                } else if (predicting == "YES"){
                    return "<button class='btn btn-primary' disabled>Predicting...</button>"
                } else if (predicting == "DONE"){
                    return "<form action=\"" + window.location.href + "/2/" + protein + "\" method=\"post\">" + csrf + "<button name=\"protein_" + protein + "\" type=\"submit\" class='btn btn-primary'>View</button></form>"
                }
            },
        }],
        rowCallback: function(row, data, index){
            if(data[1] == "Other Coronaviridae"){
                $(row).css('background-color', '#e2b9b9');
            }
            else if(data[1] == "SARS"){
                $(row).css('background-color', '#b9e2bc');
            }
            else{
                $(row).css('background-color', 'rgb(129 202 134)');
            }
            let scoreSARS = parseFloat(data[2].slice(0, -1));
            let scoreMERS = parseFloat(data[3].slice(0, -1));
            let scoreNeg = parseFloat(data[4].slice(0, -1));
            if(scoreSARS > scoreMERS && scoreSARS > scoreNeg) {
                $(row).find('td:eq(2)').css('font-weight', 'bold');
            } else if (scoreMERS > scoreSARS && scoreMERS > scoreNeg) {
                $(row).find('td:eq(3)').css('font-weight', 'bold');
            } else {
                $(row).find('td:eq(4)').css('font-weight', 'bold');
            } 
        }
    } );
    $('#tabPhase4').DataTable( {
        data: dataSet4,
        columns: [
            { title: "Viral protein" },
            { title: "Virus type" },
            { title: "Human protein" },
            { title: "Interaction" },
            { title: "Positive score" },
            { title: "Negative score" },
            { title: "Virus secondary structure" },
            { title: "Human secondary structure" },
        ], 
        dom: 'Blfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ],
        "columnDefs": [{
            "targets": -2,
            "data": null,
            "className": 'dt-body-center',
            "render": function(data, type, row){
                csrf = document.getElementById('formRunP2').children[0].outerHTML
                protein = row[0].replace(/[^0-9a-z]/gi, '');
                predicting = structures[protein];
                if(predicting == "NO"){
                    return "<button class='btn btn-primary' onClick='this.disabled=true; this.innerText=\"Predicting...\"; predictSecondary(\"VIRUS_" + protein + "\");'>Predict</button>"
                } else if (predicting == "YES"){
                    return "<button class='btn btn-primary' disabled>Predicting...</button>"
                } else if (predicting == "DONE"){
                    return "<form action=\"" + window.location.href + "/2/" + protein + "\" method=\"post\">" + csrf + "<button name=\"protein_" + protein + "\" type=\"submit\" class='btn btn-primary'>View</button></form>"
                }
            },
        }, {
            "targets": -1,
            "data": null,
            "className": 'dt-body-center',
            "render": function(data, type, row){
                csrf = document.getElementById('formRunP2').children[0].outerHTML
                protein = row[2].replace(/[^0-9a-z]/gi, '');
                predicting = structures[protein];
                if(predicting == "NO"){
                    return "<button class='btn btn-primary' onClick='this.disabled=true; this.innerText=\"Predicting...\"; predictSecondary(\"HUMAN_" + protein + "\");'>Predict</button>"
                } else if (predicting == "YES"){
                    return "<button class='btn btn-primary' disabled>Predicting...</button>"
                } else if (predicting == "DONE"){
                    return "<form action=\"" + window.location.href + "/2/" + protein + "\" method=\"post\">" + csrf + "<button name=\"protein_" + protein + "\" type=\"submit\" class='btn btn-primary'>View</button></form>"
                }
            },
        }],
        rowCallback: function(row, data, index){
            if(data[3] == "Yes"){
                $(row).css('background-color', '#b9e2bc');
            }
            else {
                $(row).css('background-color', '#e2b9b9');
            }
            let scorePos = parseFloat(data[4].slice(0, -1));
            let scoreNeg = parseFloat(data[5].slice(0, -1));
            if(scorePos > scoreNeg) {
                $(row).find('td:eq(4)').css('font-weight', 'bold');
            } else {
                $(row).find('td:eq(5)').css('font-weight', 'bold');
            }
        }
    } );

    value = JSON.parse(document.getElementById('info1-data').text);
    if (value !== ""){
        document.getElementById('tabPhase1_wrapper').style.display = "none";
    }

    value = JSON.parse(document.getElementById('info2-data').text);
    if (value === "ACTIVE") {
        document.getElementById('phase1-tab').classList.remove("active");
        document.getElementById('phase2-tab').classList.add("active");
        document.getElementById('phase1').classList.remove("show");
        document.getElementById('phase2').classList.add("show");
        document.getElementById('phase1').classList.remove("active");
        document.getElementById('phase2').classList.add("active");
    }
    else if (value !== ""){
        document.getElementById('tabPhase2_wrapper').style.display = "none";
    }

    value = JSON.parse(document.getElementById('info3-data').text);
    if (value === "ACTIVE") {
        document.getElementById('phase1-tab').classList.remove("active");
        document.getElementById('phase3-tab').classList.add("active");
        document.getElementById('phase1').classList.remove("show");
        document.getElementById('phase3').classList.add("show");
        document.getElementById('phase1').classList.remove("active");
        document.getElementById('phase3').classList.add("active");
    }
    else if (value !== ""){
        document.getElementById('tabPhase3_wrapper').style.display = "none";
    }

    value = JSON.parse(document.getElementById('info4-data').text);
    if (value === "ACTIVE") {
        document.getElementById('phase1-tab').classList.remove("active");
        document.getElementById('phase4-tab').classList.add("active");
        document.getElementById('phase1').classList.remove("show");
        document.getElementById('phase4').classList.add("show");
        document.getElementById('phase1').classList.remove("active");
        document.getElementById('phase4').classList.add("active");
    }
    else if (value !== ""){
        document.getElementById('tabPhase4_wrapper').style.display = "none";
    }

    var checkInterval = setInterval(isFileUpdated, 10000); //10000 is 10 seconds

    function isFileUpdated() {
        $.ajax({
            url: window.location.href + "/checkProgress",
            type: 'GET',
            data: {
                //'csrfmiddlewaretoken': csrftoken
            },
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data !== valueStructures){
                    valueStructures = data;
                    structures = {}
                    splits = data.split("\n");
                    for(line of splits){
                        splits = line.split(" ");
                        structures[splits[0]] = splits[1]
                    };
                    $('#tabPhase1').DataTable()
                        .rows()
                        .invalidate()
                        .draw();
                    $('#tabPhase2').DataTable()
                        .rows()
                        .invalidate()
                        .draw();
                    $('#tabPhase3').DataTable()
                        .rows()
                        .invalidate()
                        .draw();
                    $('#tabPhase4').DataTable()
                        .rows()
                        .invalidate()
                        .draw();
                } else{
                }
            }
        });
    }
} );