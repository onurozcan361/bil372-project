from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS
import datetime


app = Flask(__name__)
CORS(app)
def get_db_connection():
    connection = mysql.connector.connect(
        host='localhost',
        user='root',
        password='23644470022Onurozcan.',#bu sifrenin bulundugu her yerde kendi database sifrenizi yazmaniz gerekiyor
        database='schooldb'
    )
    return connection

# MySQL configuration
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
app.config['MYSQL_DATABASE_DB'] = 'schooldb'
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = '23644470022Onurozcan.'

@app.route('/get_students', methods=['GET'])
def get_data():
    students = get_students()
    custodians = get_custodians()
 
    return jsonify(students, custodians)

@app.route('/add_student', methods=['POST'])
def add_student():
    data = request.json
    ogrenci_id = data['newStudent']['id']
    ogrenci_adi = data['newStudent']['name']
    ogrenci_soyadi = data['newStudent']['surname']
    ogrenci_email = data['newStudent']['email']
    ogrenci_telefon_no = data['newStudent']['phoneNumber']
    ogrenci_dogum_tarihi = data['newStudent']['birthDate']
    ogrenci_adres = data['newStudent']['address']
    ogrenci_kayit_tarihi = data['newStudent']['registrationDate']
    ogrenci_aktif_mi = data['newStudent']['isActive']
    veli_bilgileri = data.get('newCustodian', {})  # Veli bilgileri
    veli_id = veli_bilgileri.get('id', None)

    conn = mysql.connector.connect(user='root', password='23644470022Onurozcan.', host='localhost', database='schooldb')
    cursor = conn.cursor()

    # Veli kontrolü ve ekleme
    
    veli_adi = veli_bilgileri['name']
    veli_soyadi = veli_bilgileri['surname']
    veli_email = veli_bilgileri['email']
    veli_telefon_no = veli_bilgileri['phoneNumber']
    cursor.execute("INSERT INTO veli (veli_id, veli_adi, veli_soyadi, veli_email, veli_telefon_no) VALUES (%s, %s, %s, %s, %s)", 
                           (veli_id, veli_adi, veli_soyadi, veli_email, veli_telefon_no))

    # Öğrenci ekleme
    cursor.execute("""
    INSERT INTO ogrenci (ogrenci_id, ogrenci_adi, ogrenci_soyadi, ogrenci_email, 
    ogrenci_telefon_no, ogrenci_dogum_tarihi, ogrenci_adres, ogrenci_kayit_tarihi, 
    ogrenci_aktif_mi, ogrenci_veli_id) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (ogrenci_id, ogrenci_adi, ogrenci_soyadi, ogrenci_email,
          ogrenci_telefon_no, ogrenci_dogum_tarihi, ogrenci_adres,
          ogrenci_kayit_tarihi, ogrenci_aktif_mi, veli_id))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(success=True, message="Öğrenci ve gerekirse veli başarıyla eklendi.")

@app.route('/update_student', methods=['POST'])
def update_student():
    data = request.json
    student_data = data['selectedStudent']
    custodian_data = data['selectedCustodian']
    ogrenci_id = student_data['id']
    ogrenci_adi = student_data['name']
    ogrenci_soyadi = student_data['surname']
    ogrenci_email = student_data['email']
    ogrenci_telefon_no = student_data['phoneNumber']
    ogrenci_dogum_tarihi = student_data['birthDate']
    ogrenci_adres = student_data['address']
    ogrenci_kayit_tarihi = student_data['registrationDate']
    ogrenci_aktif_mi = student_data['isActive']
    ogrenci_veli_id = student_data.get('custodianId')

    veli_id = custodian_data['id']
    veli_adi = custodian_data['name']
    veli_soyadi = custodian_data['surname']
    veli_email = custodian_data['email']
    veli_telefon_no = custodian_data['phoneNumber']

    conn = mysql.connector.connect(user='root', password='23644470022Onurozcan.', host='localhost', database='schooldb')
    cursor = conn.cursor()

    query_student  = """
    UPDATE ogrenci SET ogrenci_adi=%s, ogrenci_soyadi=%s, ogrenci_email=%s, 
    ogrenci_telefon_no=%s, ogrenci_dogum_tarihi=%s, ogrenci_adres=%s, 
    ogrenci_kayit_tarihi=%s, ogrenci_aktif_mi=%s, ogrenci_veli_id=%s 
    WHERE ogrenci_id=%s
    """

    cursor.execute(query_student, (ogrenci_adi, ogrenci_soyadi, ogrenci_email,
                           ogrenci_telefon_no, ogrenci_dogum_tarihi, ogrenci_adres,
                           ogrenci_kayit_tarihi, ogrenci_aktif_mi, ogrenci_veli_id,
                           ogrenci_id))

    query_custodian  = """
       UPDATE veli SET veli_adi=%s, veli_soyadi=%s, veli_email=%s, veli_telefon_no=%s
       WHERE veli_id=%s
       """
    cursor.execute(query_custodian , (veli_adi, veli_soyadi, veli_email, veli_telefon_no, veli_id))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(data)

@app.route('/delete_student/<ogrenci_id>', methods=['DELETE'])
def delete_student(ogrenci_id):
    conn = mysql.connector.connect(user='root', password='23644470022Onurozcan.', host='localhost', database='schooldb')
    cursor = conn.cursor()

    query_musaitlik = "DELETE FROM ogrenci_musaitlik_zamani WHERE ogrenci_id=%s"
    cursor.execute(query_musaitlik, (ogrenci_id,))

    query_ogrenci_ders = "DELETE FROM ogrenci_alir_ders WHERE ogrenci_id=%s"
    cursor.execute(query_ogrenci_ders, (ogrenci_id,))

    cursor.execute("SELECT ogrenci_veli_id FROM ogrenci WHERE ogrenci_id=%s", (ogrenci_id,))
    veli_id = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM ogrenci WHERE ogrenci_veli_id=%s AND ogrenci_id != %s", (veli_id, ogrenci_id))
    veliye_ait_diger_ogrenci_sayisi = cursor.fetchone()[0]
    
    query_ogrenci = "DELETE FROM ogrenci WHERE ogrenci_id=%s"
    cursor.execute(query_ogrenci, (ogrenci_id,))
    
    if veliye_ait_diger_ogrenci_sayisi == 0:
        query_veli = "DELETE FROM veli WHERE veli_id=%s"
        cursor.execute(query_veli, (veli_id,))

    

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(success=True, message="Öğrenci ve ilgili veriler başarıyla silindi.")

def get_students():
    conn = mysql.connector.connect(user='root', password='23644470022Onurozcan.', host='localhost', database='schooldb')
    cursor = conn.cursor(dictionary=True)

    query = "SELECT * FROM ogrenci"
    cursor.execute(query)
    students = cursor.fetchall()

    conn.close()

    student_list = []
    for student in students:
        student_data = {
            "id": student["ogrenci_id"],
            "name": student["ogrenci_adi"],
            "surname": student["ogrenci_soyadi"],
            "email": student["ogrenci_email"],
            "phoneNumber": student["ogrenci_telefon_no"],
            "birthDate": student["ogrenci_dogum_tarihi"].strftime('%Y-%m-%d'),
            "address": student["ogrenci_adres"],
            "registrationDate": student["ogrenci_kayit_tarihi"].strftime('%Y-%m-%d'),
            "isActive": student["ogrenci_aktif_mi"],
            "custodianId": student["ogrenci_veli_id"]
        }
        student_list.append(student_data)

    return student_list


def get_custodians():
    conn = mysql.connector.connect(user='root', password='23644470022Onurozcan.', host='localhost', database='schooldb')
    cursor = conn.cursor(dictionary=True)

    query = "SELECT * FROM veli"
    cursor.execute(query)
    custodians = cursor.fetchall()

    conn.close()

    # Veli verilerini istenen formata dönüştürün
    custodian_list = []
    for custodian in custodians:
        custodian_data = {
            "id": custodian["veli_id"],
            "name": custodian["veli_adi"],
            "surname": custodian["veli_soyadi"],
            "email": custodian["veli_email"],
            "phoneNumber": custodian["veli_telefon_no"]
        }
        custodian_list.append(custodian_data)

    return custodian_list

@app.route('/add_calisan', methods=['POST'])
def add_calisan():
    data = request.json
    calisan_id = data['id']
    calisan_ad = data['name']
    calisan_soyad = data['surname']
    calisan_email = data['email']
    calisan_telefon_no = data['phoneNumber']
    calisma_durumu = data['workStatus']
    dogum_tarihi = data['birthDate']
    maas = data['salary']
    is_pozisyonu = data['workPosition']

    conn = mysql.connector.connect(user='root', password='23644470022Onurozcan.', host='localhost', database='schooldb')
    cursor = conn.cursor()

    query = """
    INSERT INTO calisan (calisan_id, calisan_ad, calisan_soyad, calisan_email, calisan_telefon_no, calisma_durumu, dogum_tarihi, maas, is_pozisyonu) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(query, (calisan_id, calisan_ad, calisan_soyad, calisan_email, calisan_telefon_no, calisma_durumu, dogum_tarihi, maas, is_pozisyonu))

    if is_pozisyonu == 'Öğretmen':
        cursor.execute("INSERT INTO ogretmen (ogretmen_id) VALUES (%s)", (calisan_id,))
    elif is_pozisyonu == 'İdari Personel':
        pozisyon=data['administrativePosition']
        cursor.execute("INSERT INTO idari_personel (idari_personel_id, pozisyon) VALUES (%s, %s)", (calisan_id, pozisyon))
    elif is_pozisyonu == 'Temizlik Görevlisi':
        cursor.execute("INSERT INTO temizlik_gorevlisi (temizlik_gorevlisi_id) VALUES (%s)", (calisan_id,))

        
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(success=True, message="Çalışan başarıyla eklendi.")

@app.route('/update_calisan', methods=['POST'])
def update_calisan():
    data = request.json
    calisan_id = data['id']
    calisan_ad = data['name']
    calisan_soyad = data['surname']
    calisan_email = data['email']
    calisan_telefon_no = data['phoneNumber']
    calisma_durumu = data['workStatus']
    dogum_tarihi = data['birthDate']
    maas = data['salary']
    is_pozisyonu = data['workPosition']

    conn = mysql.connector.connect(user='root', password='23644470022Onurozcan.', host='localhost', database='schooldb')
    cursor = conn.cursor()

    query = """
        UPDATE calisan SET calisan_ad=%s, calisan_soyad=%s, calisan_email=%s, 
        calisan_telefon_no=%s, calisma_durumu=%s, dogum_tarihi=%s, maas=%s, 
        is_pozisyonu=%s WHERE calisan_id=%s
        """
    cursor.execute(query, (calisan_ad, calisan_soyad, calisan_email, calisan_telefon_no, calisma_durumu, dogum_tarihi, maas, is_pozisyonu, calisan_id))

    if is_pozisyonu == 'Öğretmen':
        yeni_ders = data.get('verdigi_ders')
        if yeni_ders:
            cursor.execute("UPDATE ogretmen SET verdigi_ders=%s WHERE ogretmen_id=%s", (yeni_ders, calisan_id))

    elif is_pozisyonu == 'İdari Personel':
        yeni_pozisyon = data.get('pozisyon')
        if yeni_pozisyon:
            cursor.execute("UPDATE idari_personel SET pozisyon=%s WHERE idari_personel_id=%s", (yeni_pozisyon, calisan_id))

    # Diğer pozisyonlar için benzer işlemler

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(success=True, message="Çalışan bilgileri ve ilgili veriler başarıyla güncellendi.")

@app.route('/delete_calisan/<calisan_id>', methods=['DELETE'])
def delete_calisan(calisan_id):
    conn = mysql.connector.connect(user='root', password='23644470022Onurozcan.', host='localhost', database='schooldb')
    cursor = conn.cursor()

    cursor.execute("SELECT is_pozisyonu FROM calisan WHERE calisan_id = %s", (calisan_id,))
    pozisyon = cursor.fetchone()

    if isinstance(pozisyon, dict) and pozisyon.get('is_pozisyonu') == 'Öğretmen':
        cursor.execute("UPDATE ders SET ogretmen_id = NULL WHERE ogretmen_id = %s", (calisan_id,))

        cursor.execute("DELETE FROM ogretmen_musaitlik_zamani WHERE ogretmen_id = %s", (calisan_id,))

        cursor.execute("DELETE FROM ogretmen WHERE ogretmen_id = %s", (calisan_id,))

    elif isinstance(pozisyon, dict) and pozisyon.get('is_pozisyonu') in ['Temizlik Görevlisi', 'İdari Personel']:
        tablo_adi = 'temizlik_gorevlisi' if pozisyon['is_pozisyonu'] == 'Temizlik Görevlisi' else 'idari_personel'
        cursor.execute(f"DELETE FROM {tablo_adi} WHERE {tablo_adi}_id = %s", (calisan_id,))

    cursor.execute("DELETE FROM calisan WHERE calisan_id = %s", (calisan_id,))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(success=True, message="Çalışan başarıyla silindi.")

@app.route('/get_ogretmenler', methods=['GET'])
def get_ogretmenler():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT c.*
    FROM calisan c
    JOIN ogretmen o ON c.calisan_id = o.ogretmen_id
    """
    cursor.execute(query)
    ogretmenler = cursor.fetchall()

    teacher_list = []
    for ogretmen in ogretmenler:
        teacher_data = {
            "id": ogretmen["calisan_id"],
            "name": ogretmen["calisan_ad"],
            "surname": ogretmen["calisan_soyad"],
            "email": ogretmen["calisan_email"],
            "phoneNumber": ogretmen["calisan_telefon_no"],
            "birthDate": ogretmen["dogum_tarihi"].strftime('%Y-%m-%d'),
            "workStatus": ogretmen["calisma_durumu"],
            "salary": ogretmen["maas"],
            "workPosition": ogretmen["is_pozisyonu"],
        }
        teacher_list.append(teacher_data)

    cursor.close()
    conn.close()

    return jsonify(teacher_list)

@app.route('/get_idari_personel', methods=['GET'])
def get_idari_personel():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT c.*, ip.pozisyon
    FROM calisan c
    JOIN idari_personel ip ON c.calisan_id = ip.idari_personel_id
    """
    cursor.execute(query)
    idari_personeller = cursor.fetchall()

    idari_personel_list = []
    for idari_personel in idari_personeller:
        idari_personel_data = {
            "id": idari_personel["calisan_id"],
            "name": idari_personel["calisan_ad"],
            "surname": idari_personel["calisan_soyad"],
            "email": idari_personel["calisan_email"],
            "phoneNumber": idari_personel["calisan_telefon_no"],
            "birthDate": idari_personel["dogum_tarihi"].strftime('%Y-%m-%d'),
            "workStatus": idari_personel["calisma_durumu"],
            "salary": idari_personel["maas"],
            "workPosition": idari_personel["is_pozisyonu"],
            "administrativePosition": idari_personel['pozisyon']
        }
        idari_personel_list.append(idari_personel_data)
    cursor.close()
    conn.close()

    return jsonify(idari_personel_list)

@app.route('/get_temizlik_gorevlileri', methods=['GET'])
def get_temizlik_gorevlileri():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT c.*
    FROM calisan c
    JOIN temizlik_gorevlisi tg ON c.calisan_id = tg.temizlik_gorevlisi_id
    """
    cursor.execute(query)
    raw_temizlik_gorevlileri = cursor.fetchall()

    temizlik_gorevlileri_list = []
    for temizlikci in raw_temizlik_gorevlileri:
        temizlikci_data = {
            "id": temizlikci["calisan_id"],
            "name": temizlikci["calisan_ad"],
            "surname": temizlikci["calisan_soyad"],
            "email": temizlikci["calisan_email"],
            "phoneNumber": temizlikci["calisan_telefon_no"],
            "birthDate": temizlikci["dogum_tarihi"].strftime('%Y-%m-%d'),
            "workStatus": temizlikci["calisma_durumu"],
            "salary": temizlikci["maas"],
            "workPosition": temizlikci["is_pozisyonu"]
        }
        temizlik_gorevlileri_list.append(temizlikci_data)

    cursor.close()
    conn.close()

    return jsonify(temizlik_gorevlileri_list)


@app.route('/add_ders', methods=['POST'])
def add_ders():
    data = request.json
    ders_id = data['id']
    ders_adi = data['name']
    ders_saati = data['weeklyHour']
    talep = data['demand']
    ogretmen_id = data.get('teacherId')

    conn = mysql.connector.connect(user='root', password='23644470022Onurozcan.', host='localhost', database='schooldb')
    cursor = conn.cursor()

    if ogretmen_id:
        query = """
        INSERT INTO ders (ders_id, ders_adi, ders_saati, talep, ogretmen_id) 
        VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (ders_id, ders_adi, ders_saati, talep, ogretmen_id))
    else:
        query = """
        INSERT INTO ders (ders_id, ders_adi, ders_saati, talep) 
        VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query, (ders_id, ders_adi, ders_saati, talep))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(success=True, message="Ders başarıyla eklendi.")

@app.route('/update_ders', methods=['POST'])
def update_ders():
    data = request.json
    ders_id = data['id']
    ders_adi = data['name']
    ders_saati = data['weeklyHour']
    talep = data['demand']
    ogretmen_id = data.get('teacherId')

    conn = mysql.connector.connect(user='root', password='23644470022Onurozcan.', host='localhost', database='schooldb')
    cursor = conn.cursor()

    query = """
    UPDATE ders SET ders_adi=%s, ders_saati=%s, talep=%s, ogretmen_id=%s
    WHERE ders_id=%s
    """
    cursor.execute(query, (ders_adi, ders_saati, talep, ogretmen_id, ders_id))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(success=True, message="Ders bilgileri başarıyla güncellendi.")

@app.route('/delete_ders/<ders_id>', methods=['DELETE'])
def delete_ders(ders_id):
    conn = mysql.connector.connect(user='root', password='23644470022Onurozcan.', host='localhost', database='schooldb')
    cursor = conn.cursor()

    malzeme_silme_sorgusu = "DELETE FROM ders_malzemeleri WHERE ders_id = %s"
    cursor.execute(malzeme_silme_sorgusu, (ders_id,))

    ders_silme_sorgusu = "DELETE FROM ders WHERE ders_id = %s"
    cursor.execute(ders_silme_sorgusu, (ders_id,))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(success=True, message="Ders ve ilgili malzemeler başarıyla silindi.")

@app.route('/get_ders', methods=['GET'])
def get_ders():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Dersleri ve ilgili öğretmen bilgilerini al
    query = """
    SELECT d.*, c.calisan_ad, c.calisan_soyad
    FROM ders d
    LEFT JOIN ogretmen o ON d.ogretmen_id = o.ogretmen_id
    LEFT JOIN calisan c ON o.ogretmen_id = c.calisan_id
    """
    cursor.execute(query)
    dersler = cursor.fetchall()

    ders_list = []
    for ders in dersler:
        ders_data = {
            "id": ders['ders_id'],
            "name": ders['ders_adi'],
            "weeklyHour": ders['ders_saati'],
            "demand": ders['talep'],
            "teacherId": ders['ogretmen_id'],
            "teacherName" : ders['calisan_ad'],
            "teacherSurname" : ders['calisan_soyad']
            
        }
        ders_list.append(ders_data)
    cursor.close()
    conn.close()

    # Sonuçları JSON formatına dönüştürün
    return jsonify(ders_list)



@app.route('/add_malzeme', methods=['POST'])
def add_malzeme():
    data = request.json
    malzeme_id = data['id']
    miktar = data['quantity']
    malzeme_adi = data['name']
    minimum_stok_miktari = data['minimumQuantity']
    fiyat = data['cost']

    conn = mysql.connector.connect(user='root', password='23644470022Onurozcan.', host='localhost', database='schooldb')
    cursor = conn.cursor()

    query = """
    INSERT INTO malzeme (malzeme_id, miktar, malzeme_adi, minimum_stok_miktari, fiyat)
    VALUES (%s, %s, %s, %s, %s)
    """
    cursor.execute(query, (malzeme_id, miktar, malzeme_adi, minimum_stok_miktari, fiyat))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(success=True, message="Malzeme başarıyla eklendi.")

@app.route('/update_malzeme', methods=['POST'])
def update_malzeme():
    data = request.json
    malzeme_id = data['id']
    yeni_miktar = data.get('quantity')
    yeni_malzeme_adi = data.get('name')
    yeni_minimum_stok_miktari = data.get('minimumQuantity')
    yeni_fiyat = data.get('cost')

    conn = mysql.connector.connect(user='root', password='23644470022Onurozcan.', host='localhost', database='schooldb')
    cursor = conn.cursor()

    update_parts = []
    params = []

    if yeni_miktar is not None:
        update_parts.append("miktar = %s")
        params.append(yeni_miktar)

    if yeni_malzeme_adi is not None:
        update_parts.append("malzeme_adi = %s")
        params.append(yeni_malzeme_adi)

    if yeni_minimum_stok_miktari is not None:
        update_parts.append("minumum_stok_miktari = %s")
        params.append(yeni_minimum_stok_miktari)

    if yeni_fiyat is not None:
        update_parts.append("fiyat = %s")
        params.append(yeni_fiyat)

    if update_parts:
        update_query = "UPDATE malzeme SET " + ", ".join(update_parts) + " WHERE malzeme_id = %s"
        params.append(malzeme_id)

        cursor.execute(update_query, tuple(params))
        conn.commit()

    cursor.close()
    conn.close()

    return jsonify(success=True, message="Malzeme başarıyla güncellendi.")

@app.route('/delete_malzeme/<malzeme_id>', methods=['DELETE'])
def delete_malzeme(malzeme_id):
    conn = mysql.connector.connect(user='root', password='23644470022Onurozcan.', host='localhost', database='schooldb')
    cursor = conn.cursor()

    malzeme_ders_silme_sorgusu = "DELETE FROM ders_malzemeleri WHERE malzeme_id = %s"
    cursor.execute(malzeme_ders_silme_sorgusu, (malzeme_id,))

    malzeme_silme_sorgusu = "DELETE FROM malzeme WHERE malzeme_id = %s"
    cursor.execute(malzeme_silme_sorgusu, (malzeme_id,))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(success=True, message="Malzeme ve ilgili ders malzemeleri başarıyla silindi.")

@app.route('/get_malzeme', methods=['GET'])
def get_malzeme():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT * FROM malzeme"
    cursor.execute(query)
    raw_malzemeler = cursor.fetchall()

    malzeme_list = []
    for malzeme in raw_malzemeler:
        malzeme_data = {
            "id": malzeme["malzeme_id"],
            "name": malzeme["malzeme_adi"],
            "quantity": malzeme["miktar"],
            "minimumQuantity": malzeme["minumum_stok_miktari"],
            "cost": malzeme["fiyat"]
        }
        malzeme_list.append(malzeme_data)

    cursor.close()
    conn.close()

    return jsonify(malzeme_list)

@app.route('/get_gider', methods=['GET'])
def get_gider():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT * FROM gider"
    cursor.execute(query)

    raw_giderler = cursor.fetchall()

    gider_list = []
    for gider in raw_giderler:
        gider_data = {
            "id": gider['gider_id'],
            "type": gider['gider_turu'],
            "fee": gider['tutar'],
            "date": gider['tarih'].strftime('%Y-%m-%d')
        }
        gider_list.append(gider_data)

    cursor.close()
    conn.close()

    return jsonify(gider_list)

@app.route('/delete_gider<gider_id>', methods=['DELETE'])
def delete_gider(gider_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    malzeme_ders_silme_sorgusu = "DELETE gider WHERE gider_id = %s"
    cursor.execute(malzeme_ders_silme_sorgusu, (gider_id,))

    return jsonify(success=True, message="Gider başarıyla silindi.")


@app.route('/add_gider', methods=['POST'])
def add_gider():
    data = request.json
    gider_id = data['id']
    tutar = data['fee']
    gider_turu = data['type']
    tarih = data['date']

    conn = mysql.connector.connect(user='root', password='23644470022Onurozcan.', host='localhost', database='schooldb')
    cursor = conn.cursor()

    query = """
    INSERT INTO gider (gider_id, tutar, gider_turu, tarih)
    VALUES (%s, %s, %s, %s)
    """
    cursor.execute(query, (gider_id, tutar, gider_turu, tarih))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(success=True, message="Malzeme başarıyla eklendi.")

@app.route('/get_teacher_musaitlik_zamani/<teacher_id>', methods=['GET'])
def get_teacher_musaitlik_zamani(teacher_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT omz.musaitlik_zamani_id AS id, omz.gun AS day, omz.baslangic_saati AS startTime, 
    omz.bitis_saati AS endTime, omz.ogretmen_id AS teacherId
    FROM ogretmen_musaitlik_zamani omz
    WHERE omz.ogretmen_id = %s
    """
    cursor.execute(query, (teacher_id,))
    raw_musaitlik = cursor.fetchall()

    musaitlik_list = []
    for item in raw_musaitlik:
        start_total_seconds = item["startTime"].total_seconds()
        start_hours = int(start_total_seconds // 3600)  # Saat
        start_minutes = int((start_total_seconds % 3600) // 60)  # Dakika
        end_total_seconds = item["endTime"].total_seconds()
        end_hours = int(end_total_seconds // 3600)  # Saat
        end_minutes = int((end_total_seconds % 3600) // 60)  # Dakika
        teacher_available_times = {
            "id": item["id"],
            "day": item["day"],
            "startTime": f'{start_hours:02d}:{start_minutes:02d}',
            "endTime": f'{end_hours:02d}:{end_minutes:02d}',
            "studentId": item["teacherId"]
        } 
        musaitlik_list.append(teacher_available_times)

    cursor.close()
    conn.close()

    return jsonify(musaitlik_list)

@app.route('/get_student_musaitlik_zamani/<student_id>', methods=['GET'])
def get_student_musaitlik_zamani(student_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT omz.musaitlik_zamani_id AS id, omz.gun AS day, omz.baslangic_saati AS startTime, 
    omz.bitis_saati AS endTime, omz.ogrenci_id AS studentId
    FROM ogrenci_musaitlik_zamani omz
    WHERE omz.ogrenci_id = %s
    """
    cursor.execute(query, (student_id,))
    raw_musaitlik = cursor.fetchall()

    musaitlik_list = []
    for item in raw_musaitlik:
        start_total_seconds = item["startTime"].total_seconds()
        start_hours = int(start_total_seconds // 3600)  # Saat
        start_minutes = int((start_total_seconds % 3600) // 60)  # Dakika
        end_total_seconds = item["endTime"].total_seconds()
        end_hours = int(end_total_seconds // 3600)  # Saat
        end_minutes = int((end_total_seconds % 3600) // 60)  # Dakika
        student_available_times = {
            "id": item["id"],
            "day": item["day"],
            "startTime": f'{start_hours:02d}:{start_minutes:02d}',
            "endTime": f'{end_hours:02d}:{end_minutes:02d}',
            "studentId": item["studentId"]
        } 
        musaitlik_list.append(student_available_times)

    cursor.close()
    conn.close()

    return jsonify(musaitlik_list)

if __name__ == "__main__":
    app.run(debug=True, host='localhost', port=8080)