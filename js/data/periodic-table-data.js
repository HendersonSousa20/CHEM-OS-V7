        /* ==========================================================================
           1. TABELA PERIÓDICA IUPAC
           ========================================================================== */
        const RAW_ELEMENTS = [
            [1,"H","Hidrogênio",1.008,1,1,"Não-Metal"],[2,"He","Hélio",4.0026,18,1,"Gás Nobre"],
            [3,"Li","Lítio",6.94,1,2,"Alcalino"],[4,"Be","Berílio",9.0122,2,2,"Alcalino-Térreo"],
            [5,"B","Boro",10.81,13,2,"Metalóide"],[6,"C","Carbono",12.011,14,2,"Não-Metal"],
            [7,"N","Nitrogênio",14.007,15,2,"Não-Metal"],[8,"O","Oxigênio",15.999,16,2,"Não-Metal"],
            [9,"F","Flúor",18.998,17,2,"Halogênio"],[10,"Ne","Neônio",20.180,18,2,"Gás Nobre"],
            [11,"Na","Sódio",22.990,1,3,"Alcalino"],[12,"Mg","Magnésio",24.305,2,3,"Alcalino-Térreo"],
            [13,"Al","Alumínio",26.982,13,3,"Pós-Transição"],[14,"Si","Silício",28.085,14,3,"Metalóide"],
            [15,"P","Fósforo",30.974,15,3,"Não-Metal"],[16,"S","Enxofre",32.06,16,3,"Não-Metal"],
            [17,"Cl","Cloro",35.45,17,3,"Halogênio"],[18,"Ar","Argônio",39.948,18,3,"Gás Nobre"],
            [19,"K","Potássio",39.098,1,4,"Alcalino"],[20,"Ca","Cálcio",40.078,2,4,"Alcalino-Térreo"],
            [21,"Sc","Escândio",44.956,3,4,"Transição"],[22,"Ti","Titânio",47.867,4,4,"Transição"],
            [23,"V","Vanádio",50.942,5,4,"Transição"],[24,"Cr","Cromo",51.996,6,4,"Transição"],
            [25,"Mn","Manganês",54.938,7,4,"Transição"],[26,"Fe","Ferro",55.845,8,4,"Transição"],
            [27,"Co","Cobalto",58.933,9,4,"Transição"],[28,"Ni","Níquel",58.693,10,4,"Transição"],
            [29,"Cu","Cobre",63.546,11,4,"Transição"],[30,"Zn","Zinco",65.38,12,4,"Transição"],
            [31,"Ga","Gálio",69.723,13,4,"Pós-Transição"],[32,"Ge","Germânio",72.630,14,4,"Metalóide"],
            [33,"As","Arsênio",74.922,15,4,"Metalóide"],[34,"Se","Selênio",78.971,16,4,"Não-Metal"],
            [35,"Br","Bromo",79.904,17,4,"Halogênio"],[36,"Kr","Criptônio",83.798,18,4,"Gás Nobre"],
            [37,"Rb","Rubídio",85.468,1,5,"Alcalino"],[38,"Sr","Estrôncio",87.62,2,5,"Alcalino-Térreo"],
            [39,"Y","Ítrio",88.906,3,5,"Transição"],[40,"Zr","Zircônio",91.224,4,5,"Transição"],
            [41,"Nb","Nióbio",92.906,5,5,"Transição"],[42,"Mo","Molibdênio",95.95,6,5,"Transição"],
            [43,"Tc","Tecnécio",98,7,5,"Transição"],[44,"Ru","Rutênio",101.07,8,5,"Transição"],
            [45,"Rh","Ródio",102.91,9,5,"Transição"],[46,"Pd","Paládio",106.42,10,5,"Transição"],
            [47,"Ag","Prata",107.87,11,5,"Transição"],[48,"Cd","Cádmio",112.41,12,5,"Transição"],
            [49,"In","Índio",114.82,13,5,"Pós-Transição"],[50,"Sn","Estanho",118.71,14,5,"Pós-Transição"],
            [51,"Sb","Antimônio",121.76,15,5,"Metalóide"],[52,"Te","Telúrio",127.60,16,5,"Metalóide"],
            [53,"I","Iodo",126.90,17,5,"Halogênio"],[54,"Xe","Xenônio",131.29,18,5,"Gás Nobre"],
            [55,"Cs","Césio",132.91,1,6,"Alcalino"],[56,"Ba","Bário",137.33,2,6,"Alcalino-Térreo"],
            [57,"La","Lantânio",138.91,3,6,"Lantanídeo"],[58,"Ce","Cério",140.12,3,6,"Lantanídeo"],
            [59,"Pr","Praseodímio",140.91,3,6,"Lantanídeo"],[60,"Nd","Neodímio",144.24,3,6,"Lantanídeo"],
            [61,"Pm","Promécio",145,3,6,"Lantanídeo"],[62,"Sm","Samário",150.36,3,6,"Lantanídeo"],
            [63,"Eu","Európio",151.96,3,6,"Lantanídeo"],[64,"Gd","Gadolínio",157.25,3,6,"Lantanídeo"],
            [65,"Tb","Térbio",158.93,3,6,"Lantanídeo"],[66,"Dy","Disprósio",162.50,3,6,"Lantanídeo"],
            [67,"Ho","Hólmio",164.93,3,6,"Lantanídeo"],[68,"Er","Érbio",167.26,3,6,"Lantanídeo"],
            [69,"Tm","Túlio",168.93,3,6,"Lantanídeo"],[70,"Yb","Itérbio",173.05,3,6,"Lantanídeo"],
            [71,"Lu","Lutécio",174.97,3,6,"Lantanídeo"],[72,"Hf","Háfnio",178.49,4,6,"Transição"],
            [73,"Ta","Tântalo",180.95,5,6,"Transição"],[74,"W","Tungstênio",183.84,6,6,"Transição"],
            [75,"Re","Rênio",186.21,7,6,"Transição"],[76,"Os","Ósmio",190.23,8,6,"Transição"],
            [77,"Ir","Irídio",192.22,9,6,"Transição"],[78,"Pt","Platina",195.08,10,6,"Transição"],
            [79,"Au","Ouro",196.97,11,6,"Transição"],[80,"Hg","Mercúrio",200.59,12,6,"Transição"],
            [81,"Tl","Tálio",204.38,13,6,"Pós-Transição"],[82,"Pb","Chumbo",207.2,14,6,"Pós-Transição"],
            [83,"Bi","Bismuto",208.98,15,6,"Pós-Transição"],[84,"Po","Polônio",209,16,6,"Pós-Transição"],
            [85,"At","Astato",210,17,6,"Halogênio"],[86,"Rn","Radônio",222,18,6,"Gás Nobre"],
            [87,"Fr","Frâncio",223,1,7,"Alcalino"],[88,"Ra","Rádio",226,2,7,"Alcalino-Térreo"],
            [89,"Ac","Actínio",227,3,7,"Actinídeo"],[90,"Th","Tório",232.04,3,7,"Actinídeo"],
            [91,"Pa","Protactínio",231.04,3,7,"Actinídeo"],[92,"U","Urânio",238.03,3,7,"Actinídeo"],
            [93,"Np","Neptúnio",237,3,7,"Actinídeo"],[94,"Pu","Plutônio",244,3,7,"Actinídeo"],
            [95,"Am","Amerício",243,3,7,"Actinídeo"],[96,"Cm","Cúrio",247,3,7,"Actinídeo"],
            [97,"Bk","Berquélio",247,3,7,"Actinídeo"],[98,"Cf","Califórnio",251,3,7,"Actinídeo"],
            [99,"Es","Einstênio",252,3,7,"Actinídeo"],[100,"Fm","Férmio",257,3,7,"Actinídeo"],
            [101,"Md","Mendelévio",258,3,7,"Actinídeo"],[102,"No","Nobélio",259,3,7,"Actinídeo"],
            [103,"Lr","Laurêncio",262,3,7,"Actinídeo"],[104,"Rf","Rutherfordio",267,4,7,"Transição"],
            [105,"Db","Dúbnio",268,5,7,"Transição"],[106,"Sg","Seabórgio",269,6,7,"Transição"],
            [107,"Bh","Bório",270,7,7,"Transição"],[108,"Hs","Hássio",277,8,7,"Transição"],
            [109,"Mt","Meitnério",278,9,7,"Transição"],[110,"Ds","Darmstádio",281,10,7,"Transição"],
            [111,"Rg","Roentgênio",282,11,7,"Transição"],[112,"Cn","Copernício",285,12,7,"Transição"],
            [113,"Nh","Nipônio",286,13,7,"Pós-Transição"],[114,"Fl","Fleróvio",289,14,7,"Pós-Transição"],
            [115,"Mc","Moscóvio",290,15,7,"Pós-Transição"],[116,"Lv","Livermório",293,16,7,"Pós-Transição"],
            [117,"Ts","Tenesso",294,17,7,"Halogênio"],[118,"Og","Oganessônio",294,18,7,"Gás Nobre"]
        ];

        const ATOMIC_WEIGHTS = {};
        const ELEMENTS_DB = RAW_ELEMENTS.map(e => {
            ATOMIC_WEIGHTS[e[1]] = e[3];
            return { num: e[0], sym: e[1], name: e[2], mass: e[3], group: e[4], period: e[5], cat: e[6] };
        });

        function escapeHTML(str) {
            return String(str || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
        }
