from flask import Flask, request, jsonify
from flaskext.mysql import MySQL

import json

app = Flask(__name__)

# MySQL configuration
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
app.config['MYSQL_DATABASE_DB'] = 'okul'
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = '7201'

mysql = MySQL(app)

@app.route('/get_students', methods=['GET'])
def get_data():
    students = get_students()
    custodians = get_custodians()

    return jsonify(students, custodians)

@app.route('/add_student', methods=['POST'])
def add_student():
    data = request.json
    ogrenci_id = data['id']
    ogrenci_adi = data['name']
    ogrenci_soyadi = data['surname']
    ogrenci_email = data['email']
    ogrenci_telefon_no = data['phoneNumber']
    ogrenci_dogum_tarihi = data['birthDate']
    ogrenci_adres = data['address']
    ogrenci_kayit_tarihi = data['registrationDate']
    ogrenci_aktif_mi = data['isActive']
    ogrenci_veli_id = data.get('custodianId')

    conn = mysql.connector.connect(user='root', password='7201', host='localhost', database='okul')
    cursor = conn.cursor()

    query = """
    INSERT INTO ogrenci (ogrenci_id, ogrenci_adi, ogrenci_soyadi, ogrenci_email, 
    ogrenci_telefon_no, ogrenci_dogum_tarihi, ogrenci_adres, ogrenci_kayit_tarihi, 
    ogrenci_aktif_mi, ogrenci_veli_id) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(query, (ogrenci_id, ogrenci_adi, ogrenci_soyadi, ogrenci_email,
                           ogrenci_telefon_no, ogrenci_dogum_tarihi, ogrenci_adres,
                           ogrenci_kayit_tarihi, ogrenci_aktif_mi, ogrenci_veli_id))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(success=True, message="Öğrenci başarıyla eklendi.")

@app.route('/update_student', methods=['POST'])
def update_student():
    data = request.json
    ogrenci_id = data['id']
    ogrenci_adi = data['name']
    ogrenci_soyadi = data['surname']
    ogrenci_email = data['email']
    ogrenci_telefon_no = data['phoneNumber']
    ogrenci_dogum_tarihi = data['birthDate']
    ogrenci_adres = data['address']
    ogrenci_kayit_tarihi = data['registrationDate']
    ogrenci_aktif_mi = data['isActive']
    ogrenci_veli_id = data.get('custodianId')

    conn = mysql.connect()
    cursor = conn.cursor()

    query = """
    UPDATE ogrenci SET ogrenci_adi=%s, ogrenci_soyadi=%s, ogrenci_email=%s, 
    ogrenci_telefon_no=%s, ogrenci_dogum_tarihi=%s, ogrenci_adres=%s, 
    ogrenci_kayit_tarihi=%s, ogrenci_aktif_mi=%s, ogrenci_veli_id=%s 
    WHERE ogrenci_id=%s
    """

    cursor.execute(query, (ogrenci_adi, ogrenci_soyadi, ogrenci_email,
                           ogrenci_telefon_no, ogrenci_dogum_tarihi, ogrenci_adres,
                           ogrenci_kayit_tarihi, ogrenci_aktif_mi, ogrenci_veli_id,
                           ogrenci_id))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(data)

@app.route('/delete_student', methods=['POST'])
def delete_student():
    data = request.json
    ogrenci_id = data.get('id')

    conn = mysql.connect()
    cursor = conn.cursor()

    query = "DELETE FROM ogrenci WHERE ogrenci_id=%s"
    cursor.execute(query, (ogrenci_id,))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(success=True, message="Öğrenci başarıyla silindi.")

def get_students():
    conn = mysql.connector.connect(user='root', password='7201', host='localhost', database='okul')
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

@app.route('/add_veli', methods=['POST'])
def add_veli():
    data = request.json
    veli_id = data['id']
    veli_adi = data['name']
    veli_soyadi = data['surname']
    veli_email = data['email']
    veli_telefon_no = data['phoneNumber']

    conn = mysql.connector.connect(user='root', password='7201', host='localhost', database='okul')
    cursor = conn.cursor()

    query = """
    INSERT INTO veli (veli_id, veli_adi, veli_soyadi, veli_email, veli_telefon_no) 
    VALUES (%s, %s, %s, %s, %s)
    """
    cursor.execute(query, (veli_id, veli_adi, veli_soyadi, veli_email, veli_telefon_no))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(success=True, message="Veli başarıyla eklendi.")

@app.route('/update_veli', methods=['POST'])
def update_veli():
    data = request.json
    veli_id = data['id']
    veli_adi = data['name']
    veli_soyadi = data['surname']
    veli_email = data['email']
    veli_telefon_no = data['phoneNumber']

    conn = mysql.connect()
    cursor = conn.cursor()

    query = """
    UPDATE veli SET veli_adi=%s, veli_soyadi=%s, veli_email=%s, veli_telefon_no=%s
    WHERE veli_id=%s
    """
    cursor.execute(query, (veli_adi, veli_soyadi, veli_email, veli_telefon_no, veli_id))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(success=True, message="Veli başarıyla güncellendi.")

@app.route('/delete_veli', methods=['POST'])
def delete_veli():
    data = request.json
    veli_id = data.get('id')

    conn = mysql.connect()
    cursor = conn.cursor()

    query = "DELETE FROM veli WHERE veli_id=%s"
    cursor.execute(query, (veli_id,))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(success=True, message="Veli başarıyla silindi.")

def get_custodians():
    conn = mysql.connector.connect(user='root', password='7201', host='localhost', database='okul')
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

    conn = mysql.connector.connect(user='root', password='7201', host='localhost', database='okul')
    cursor = conn.cursor()

    query = """
    INSERT INTO calisan (calisan_id, calisan_ad, calisan_soyad, calisan_email, calisan_telefon_no, calisma_durumu, dogum_tarihi, maas, is_pozisyonu) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(query, (calisan_id, calisan_ad, calisan_soyad, calisan_email, calisan_telefon_no, calisma_durumu, dogum_tarihi, maas, is_pozisyonu))

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

    conn = mysql.connector.connect(user='root', password='7201', host='localhost', database='okul')
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

@app.route('/delete_calisan', methods=['POST'])
def delete_calisan():
    data = request.json
    calisan_id = data.get('id')

    conn = mysql.connect()
    cursor = conn.cursor()

    cursor.execute("SELECT is_pozisyonu FROM calisan WHERE calisan_id=%s", (calisan_id,))
    pozisyon = cursor.fetchone()

    if pozisyon and pozisyon[0] == 'Öğretmen':
        cursor.execute("DELETE FROM ders WHERE ogretmen_id=%s", (calisan_id,))

    elif pozisyon and pozisyon[0] == 'İdari Personel':
        cursor.execute("UPDATE idari_personel SET pozisyon=NULL WHERE idari_personel_id=%s", (calisan_id,))

    cursor.execute("DELETE FROM calisan WHERE calisan_id=%s", (calisan_id,))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(success=True, message="Çalışan ve ilgili veriler başarıyla silindi.")

@app.route('/ekle_pozisyon_idari_personel', methods=['POST'])
def add_update_pozisyon_idari_personel():
    data = request.json
    idari_personel_id = data['id']
    yeni_pozisyon = data['administrativePosition']

    conn = mysql.connector.connect(user='your_username', password='your_password', host='127.0.0.1', database='your_database')
    cursor = conn.cursor()

    cursor.execute("SELECT pozisyon FROM idari_personel WHERE idari_personel_id = %s", (idari_personel_id,))
    mevcut_pozisyon = cursor.fetchone()

    if mevcut_pozisyon:
        cursor.execute("UPDATE idari_personel SET pozisyon = %s WHERE idari_personel_id = %s", (yeni_pozisyon, idari_personel_id))
    else:
        cursor.execute("INSERT INTO idari_personel (idari_personel_id, pozisyon) VALUES (%s, %s)", (idari_personel_id, yeni_pozisyon))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(success=True, message="İdari personel pozisyonu başarıyla eklendi veya güncellendi.")

@app.route('/add_ders', methods=['POST'])
def add_ders():
    data = request.json
    ders_id = data['id']
    ders_adi = data['name']
    ders_saati = data['weeklyHour']
    talep = data['demand']
    ogretmen_id = data.get('teacherId')

    conn = mysql.connector.connect(user='root', password='7201', host='localhost', database='okul')
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

    conn = mysql.connector.connect(user='root', password='7201', host='localhost', database='okul')
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
    conn = mysql.connector.connect(user='root', password='7201', host='localhost', database='okul')
    cursor = conn.cursor()

    cursor.execute("SELECT ogretmen_id FROM ders WHERE ders_id = %s", (ders_id,))
    result = cursor.fetchone()
    if result:
        ogretmen_id = result[0]

        cursor.execute("UPDATE ogretmen SET verdigi_ders = NULL WHERE ogretmen_id = %s AND verdigi_ders = %s", (ogretmen_id, ders_id))

    query = "DELETE FROM ders WHERE ders_id = %s"
    cursor.execute(query, (ders_id,))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(success=True, message="Ders başarıyla silindi.")


@app.route('/add_ogrenci_musaitlik', methods=['POST'])
def add_ogrenci_musaitlik():
    data = request.json
    ogrenci_id = data['id']
    baslangic_saati = data['startTime']
    bitis_saati = data['endTime']

    conn = mysql.connector.connect(user='root', password='7201', host='localhost', database='okul')
    cursor = conn.cursor()

    query = """
    INSERT INTO ogrenci_musaitlik (ogrenci_id, baslangic_saati, bitis_saati)
    VALUES (%s, %s, %s)
    """
    cursor.execute(query, (ogrenci_id, baslangic_saati, bitis_saati))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(success=True, message="Öğrenci müsaitlik zamanı başarıyla eklendi.")

@app.route('/update_ogrenci_musaitlik', methods=['POST'])
def update_ogrenci_musaitlik():
    data = request.json
    ogrenci_id = data['id']
    baslangic_saati = data['startTime']
    bitis_saati = data['endTime']

    conn = mysql.connector.connect(user='root', password='7201', host='localhost', database='okul')
    cursor = conn.cursor()

    query = """
    UPDATE ogrenci_musaitlik SET baslangic_saati=%s, bitis_saati=%s 
    WHERE ogrenci_id=%s
    """
    cursor.execute(query, (baslangic_saati, bitis_saati, ogrenci_id))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(success=True, message="Öğrenci müsaitlik bilgisi başarıyla güncellendi.")

@app.route('/delete_ogrenci_musaitlik/<ogrenci_id>', methods=['DELETE'])
def delete_ogrenci_musaitlik(ogrenci_id):
    conn = mysql.connector.connect(user='root', password='7201', host='localhost', database='okul')
    cursor = conn.cursor()

    query = "DELETE FROM ogrenci_musaitlik WHERE ogrenci_id = %s"
    cursor.execute(query, (ogrenci_id,))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(success=True, message="Öğrenci müsaitlik bilgisi başarıyla silindi.")


@app.route('/add_malzeme', methods=['POST'])
def add_malzeme():
    data = request.json
    malzeme_id = data['id']
    miktar = data['quantity']
    malzeme_adi = data['name']
    minimum_stok_miktari = data['minimumQuantity']
    fiyat = data['cost']

    conn = mysql.connector.connect(user='root', password='7201', host='localhost', database='okul')
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

    conn = mysql.connector.connect(user='your_username', password='your_password', host='127.0.0.1', database='your_database')
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
        update_parts.append("minimum_stok_miktari = %s")
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
    conn = mysql.connector.connect(user='root', password='7201', host='localhost', database='okul')
    cursor = conn.cursor()

    query = "DELETE FROM malzeme WHERE malzeme_id = %s"
    cursor.execute(query, (malzeme_id,))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify(success=True, message="Malzeme başarıyla silindi.")


if __name__ == "__main__":
    print(get_students())
    app.run(debug=True)