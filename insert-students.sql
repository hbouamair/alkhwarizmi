-- ============================================================
-- Script SQL pour ajouter des élèves aux différentes classes
-- Lycée Alkhwarizmi - Aït Amira
-- ============================================================
-- 
-- Instructions:
-- 1. Exécutez ce script dans l'éditeur SQL de Supabase
-- 2. Les mots de passe par défaut sont "123456" (à changer en production)
-- 3. Les emails sont générés automatiquement (à adapter selon vos besoins)
-- ============================================================

-- Fonction pour déterminer le niveau à partir de la classe
-- (Note: Cette fonction est utilisée dans l'application, on l'implémente ici pour référence)

-- ============================================================
-- TRONC COMMUN SCIENTIFIQUE (TC-S)
-- ============================================================

-- TC-S-1
INSERT INTO students (massar, first_name, last_name, email, password, classe, niveau) VALUES
('G201001001', 'Mohamed', 'Alaoui', 'mohamed.alaoui@lycee.ma', '123456', 'TC-S-1', 'Tronc Commun Scientifique'),
('G201001002', 'Aicha', 'Bennani', 'aicha.bennani@lycee.ma', '123456', 'TC-S-1', 'Tronc Commun Scientifique'),
('G201001003', 'Hassan', 'Chraibi', 'hassan.chraibi@lycee.ma', '123456', 'TC-S-1', 'Tronc Commun Scientifique'),
('G201001004', 'Sanae', 'El Fassi', 'sanae.elfassi@lycee.ma', '123456', 'TC-S-1', 'Tronc Commun Scientifique'),
('G201001005', 'Omar', 'Idrissi', 'omar.idrissi@lycee.ma', '123456', 'TC-S-1', 'Tronc Commun Scientifique');

-- TC-S-2
INSERT INTO students (massar, first_name, last_name, email, password, classe, niveau) VALUES
('G201002001', 'Fatima', 'Kadiri', 'fatima.kadiri@lycee.ma', '123456', 'TC-S-2', 'Tronc Commun Scientifique'),
('G201002002', 'Youssef', 'Lamrani', 'youssef.lamrani@lycee.ma', '123456', 'TC-S-2', 'Tronc Commun Scientifique'),
('G201002003', 'Khadija', 'Mansouri', 'khadija.mansouri@lycee.ma', '123456', 'TC-S-2', 'Tronc Commun Scientifique'),
('G201002004', 'Mehdi', 'Naciri', 'mehdi.naciri@lycee.ma', '123456', 'TC-S-2', 'Tronc Commun Scientifique'),
('G201002005', 'Nadia', 'Ouazzani', 'nadia.ouazzani@lycee.ma', '123456', 'TC-S-2', 'Tronc Commun Scientifique');

-- TC-S-3
INSERT INTO students (massar, first_name, last_name, email, password, classe, niveau) VALUES
('G201003001', 'Rachid', 'Rahmani', 'rachid.rahmani@lycee.ma', '123456', 'TC-S-3', 'Tronc Commun Scientifique'),
('G201003002', 'Souad', 'Saadi', 'souad.saadi@lycee.ma', '123456', 'TC-S-3', 'Tronc Commun Scientifique'),
('G201003003', 'Amine', 'Tazi', 'amine.tazi@lycee.ma', '123456', 'TC-S-3', 'Tronc Commun Scientifique'),
('G201003004', 'Laila', 'Zahiri', 'laila.zahiri@lycee.ma', '123456', 'TC-S-3', 'Tronc Commun Scientifique'),
('G201003005', 'Bilal', 'Zouhair', 'bilal.zouhair@lycee.ma', '123456', 'TC-S-3', 'Tronc Commun Scientifique');

-- ============================================================
-- TRONC COMMUN LITTÉRAIRE (TC-L)
-- ============================================================

-- TC-L-1
INSERT INTO students (massar, first_name, last_name, email, password, classe, niveau) VALUES
('G201101001', 'Salma', 'Ait Ali', 'salma.aitali@lycee.ma', '123456', 'TC-L-1', 'Tronc Commun Littéraire'),
('G201101002', 'Karim', 'Berrada', 'karim.berrada@lycee.ma', '123456', 'TC-L-1', 'Tronc Commun Littéraire'),
('G201101003', 'Imane', 'Cherkaoui', 'imane.cherkaoui@lycee.ma', '123456', 'TC-L-1', 'Tronc Commun Littéraire'),
('G201101004', 'Anass', 'Dahbi', 'anass.dahbi@lycee.ma', '123456', 'TC-L-1', 'Tronc Commun Littéraire'),
('G201101005', 'Hiba', 'El Haddad', 'hiba.elhaddad@lycee.ma', '123456', 'TC-L-1', 'Tronc Commun Littéraire');

-- TC-L-2
INSERT INTO students (massar, first_name, last_name, email, password, classe, niveau) VALUES
('G201102001', 'Yassine', 'Fassi', 'yassine.fassi@lycee.ma', '123456', 'TC-L-2', 'Tronc Commun Littéraire'),
('G201102002', 'Nour', 'Ghazi', 'nour.ghazi@lycee.ma', '123456', 'TC-L-2', 'Tronc Commun Littéraire'),
('G201102003', 'Reda', 'Hajji', 'reda.hajji@lycee.ma', '123456', 'TC-L-2', 'Tronc Commun Littéraire'),
('G201102004', 'Ines', 'Jazouli', 'ines.jazouli@lycee.ma', '123456', 'TC-L-2', 'Tronc Commun Littéraire'),
('G201102005', 'Tarik', 'Kettani', 'tarik.kettani@lycee.ma', '123456', 'TC-L-2', 'Tronc Commun Littéraire');

-- ============================================================
-- 1ÈRE BACCALAURÉAT SCIENCES EXPÉRIMENTALES (1BAC-SE)
-- ============================================================

-- 1BAC-SE-1
INSERT INTO students (massar, first_name, last_name, email, password, classe, niveau) VALUES
('G202001001', 'Amal', 'Lahlou', 'amal.lahlou@lycee.ma', '123456', '1BAC-SE-1', '1ère Bac Sciences Expérimentales'),
('G202001002', 'Badr', 'Mekouar', 'badr.mekouar@lycee.ma', '123456', '1BAC-SE-1', '1ère Bac Sciences Expérimentales'),
('G202001003', 'Chaimae', 'Naji', 'chaimae.naji@lycee.ma', '123456', '1BAC-SE-1', '1ère Bac Sciences Expérimentales'),
('G202001004', 'Driss', 'Ouali', 'driss.ouali@lycee.ma', '123456', '1BAC-SE-1', '1ère Bac Sciences Expérimentales'),
('G202001005', 'Emane', 'Qadiri', 'emane.qadiri@lycee.ma', '123456', '1BAC-SE-1', '1ère Bac Sciences Expérimentales');

-- 1BAC-SE-2
INSERT INTO students (massar, first_name, last_name, email, password, classe, niveau) VALUES
('G202002001', 'Fadwa', 'Rachidi', 'fadwa.rachidi@lycee.ma', '123456', '1BAC-SE-2', '1ère Bac Sciences Expérimentales'),
('G202002002', 'Ghassan', 'Sefrioui', 'ghassan.sefrioui@lycee.ma', '123456', '1BAC-SE-2', '1ère Bac Sciences Expérimentales'),
('G202002003', 'Hind', 'Tahiri', 'hind.tahiri@lycee.ma', '123456', '1BAC-SE-2', '1ère Bac Sciences Expérimentales'),
('G202002004', 'Ilyas', 'Wahbi', 'ilyas.wahbi@lycee.ma', '123456', '1BAC-SE-2', '1ère Bac Sciences Expérimentales'),
('G202002005', 'Jihane', 'Yousfi', 'jihane.yousfi@lycee.ma', '123456', '1BAC-SE-2', '1ère Bac Sciences Expérimentales');

-- ============================================================
-- 1ÈRE BACCALAURÉAT SCIENCES LITTÉRAIRES (1BAC-SL)
-- ============================================================

-- 1BAC-SL-1
INSERT INTO students (massar, first_name, last_name, email, password, classe, niveau) VALUES
('G202101001', 'Kawtar', 'Ziani', 'kawtar.ziani@lycee.ma', '123456', '1BAC-SL-1', '1ère Bac Sciences Littéraires'),
('G202101002', 'Larbi', 'Achour', 'larbi.achour@lycee.ma', '123456', '1BAC-SL-1', '1ère Bac Sciences Littéraires'),
('G202101003', 'Meryem', 'Bouazza', 'meryem.bouazza@lycee.ma', '123456', '1BAC-SL-1', '1ère Bac Sciences Littéraires'),
('G202101004', 'Nabil', 'Chaoui', 'nabil.chaoui@lycee.ma', '123456', '1BAC-SL-1', '1ère Bac Sciences Littéraires'),
('G202101005', 'Oumaima', 'Dari', 'oumaima.dari@lycee.ma', '123456', '1BAC-SL-1', '1ère Bac Sciences Littéraires');

-- 1BAC-SL-2
INSERT INTO students (massar, first_name, last_name, email, password, classe, niveau) VALUES
('G202102001', 'Pascal', 'El Amrani', 'pascal.elamrani@lycee.ma', '123456', '1BAC-SL-2', '1ère Bac Sciences Littéraires'),
('G202102002', 'Qods', 'Fadili', 'qods.fadili@lycee.ma', '123456', '1BAC-SL-2', '1ère Bac Sciences Littéraires'),
('G202102003', 'Rim', 'Ghanmi', 'rim.ghanmi@lycee.ma', '123456', '1BAC-SL-2', '1ère Bac Sciences Littéraires'),
('G202102004', 'Said', 'Hafidi', 'said.hafidi@lycee.ma', '123456', '1BAC-SL-2', '1ère Bac Sciences Littéraires'),
('G202102005', 'Touria', 'Ibrahimi', 'touria.ibrahimi@lycee.ma', '123456', '1BAC-SL-2', '1ère Bac Sciences Littéraires');

-- ============================================================
-- 2ÈME BACCALAURÉAT SCIENCES DE LA VIE ET DE LA TERRE (2BAC-SVT)
-- ============================================================

-- 2BAC-SVT-1
INSERT INTO students (massar, first_name, last_name, email, password, classe, niveau) VALUES
('G203001001', 'Youssef', 'El Amrani', 'youssef.amrani@lycee.ma', '123456', '2BAC-SVT-1', '2ème Bac Sciences de la Vie et de la Terre'),
('G203001002', 'Zineb', 'Jazouli', 'zineb.jazouli@lycee.ma', '123456', '2BAC-SVT-1', '2ème Bac Sciences de la Vie et de la Terre'),
('G203001003', 'Adil', 'Kettani', 'adil.kettani@lycee.ma', '123456', '2BAC-SVT-1', '2ème Bac Sciences de la Vie et de la Terre'),
('G203001004', 'Bouchra', 'Lahlou', 'bouchra.lahlou@lycee.ma', '123456', '2BAC-SVT-1', '2ème Bac Sciences de la Vie et de la Terre'),
('G203001005', 'Chakib', 'Mekouar', 'chakib.mekouar@lycee.ma', '123456', '2BAC-SVT-1', '2ème Bac Sciences de la Vie et de la Terre');

-- 2BAC-SVT-2
INSERT INTO students (massar, first_name, last_name, email, password, classe, niveau) VALUES
('G203002001', 'Dounia', 'Naji', 'dounia.naji@lycee.ma', '123456', '2BAC-SVT-2', '2ème Bac Sciences de la Vie et de la Terre'),
('G203002002', 'Elias', 'Ouali', 'elias.ouali@lycee.ma', '123456', '2BAC-SVT-2', '2ème Bac Sciences de la Vie et de la Terre'),
('G203002003', 'Firdaous', 'Qadiri', 'firdaous.qadiri@lycee.ma', '123456', '2BAC-SVT-2', '2ème Bac Sciences de la Vie et de la Terre'),
('G203002004', 'Ghita', 'Rachidi', 'ghita.rachidi@lycee.ma', '123456', '2BAC-SVT-2', '2ème Bac Sciences de la Vie et de la Terre'),
('G203002005', 'Hamza', 'Sefrioui', 'hamza.sefrioui@lycee.ma', '123456', '2BAC-SVT-2', '2ème Bac Sciences de la Vie et de la Terre');

-- ============================================================
-- 2ÈME BACCALAURÉAT PHYSIQUE-CHIMIE (2BAC-PC)
-- ============================================================

-- 2BAC-PC-1
INSERT INTO students (massar, first_name, last_name, email, password, classe, niveau) VALUES
('G203101001', 'Ibtissam', 'Tahiri', 'ibtissam.tahiri@lycee.ma', '123456', '2BAC-PC-1', '2ème Bac Physique-Chimie'),
('G203101002', 'Jamal', 'Wahbi', 'jamal.wahbi@lycee.ma', '123456', '2BAC-PC-1', '2ème Bac Physique-Chimie'),
('G203101003', 'Kenza', 'Yousfi', 'kenza.yousfi@lycee.ma', '123456', '2BAC-PC-1', '2ème Bac Physique-Chimie'),
('G203101004', 'Lahcen', 'Ziani', 'lahcen.ziani@lycee.ma', '123456', '2BAC-PC-1', '2ème Bac Physique-Chimie'),
('G203101005', 'Mariam', 'Achour', 'mariam.achour@lycee.ma', '123456', '2BAC-PC-1', '2ème Bac Physique-Chimie');

-- ============================================================
-- 2ÈME BACCALAURÉAT SCIENCES MATHÉMATIQUES (2BAC-SM)
-- ============================================================

-- 2BAC-SM-1
INSERT INTO students (massar, first_name, last_name, email, password, classe, niveau) VALUES
('G203201001', 'Nabil', 'Bouazza', 'nabil.bouazza@lycee.ma', '123456', '2BAC-SM-1', '2ème Bac Sciences Mathématiques'),
('G203201002', 'Oumaima', 'Chaoui', 'oumaima.chaoui@lycee.ma', '123456', '2BAC-SM-1', '2ème Bac Sciences Mathématiques'),
('G203201003', 'Pascal', 'Dari', 'pascal.dari@lycee.ma', '123456', '2BAC-SM-1', '2ème Bac Sciences Mathématiques'),
('G203201004', 'Qods', 'El Amrani', 'qods.elamrani@lycee.ma', '123456', '2BAC-SM-1', '2ème Bac Sciences Mathématiques'),
('G203201005', 'Rim', 'Fadili', 'rim.fadili@lycee.ma', '123456', '2BAC-SM-1', '2ème Bac Sciences Mathématiques');

-- ============================================================
-- 2ÈME BACCALAURÉAT SCIENCES LITTÉRAIRES (2BAC-SL)
-- ============================================================

-- 2BAC-SL-1
INSERT INTO students (massar, first_name, last_name, email, password, classe, niveau) VALUES
('G203301001', 'Said', 'Ghanmi', 'said.ghanmi@lycee.ma', '123456', '2BAC-SL-1', '2ème Bac Sciences Littéraires'),
('G203301002', 'Touria', 'Hafidi', 'touria.hafidi@lycee.ma', '123456', '2BAC-SL-1', '2ème Bac Sciences Littéraires'),
('G203301003', 'Yassine', 'Ibrahimi', 'yassine.ibrahimi@lycee.ma', '123456', '2BAC-SL-1', '2ème Bac Sciences Littéraires'),
('G203301004', 'Zineb', 'Jazouli', 'zineb.jazouli2@lycee.ma', '123456', '2BAC-SL-1', '2ème Bac Sciences Littéraires'),
('G203301005', 'Adil', 'Kettani', 'adil.kettani2@lycee.ma', '123456', '2BAC-SL-1', '2ème Bac Sciences Littéraires');

-- ============================================================
-- VÉRIFICATION
-- ============================================================
-- Pour vérifier le nombre d'élèves par classe, exécutez:
-- SELECT classe, COUNT(*) as nombre_eleves FROM students GROUP BY classe ORDER BY classe;

-- Pour voir tous les élèves d'une classe spécifique:
-- SELECT * FROM students WHERE classe = 'TC-S-1' ORDER BY last_name, first_name;
