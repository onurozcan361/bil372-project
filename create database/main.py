from faker import Faker
import random
import mysql.connector
from mysql.connector import Error

fake = Faker()

host = 'localhost'
database = 'okul'
user = 'root'
password = '23644470022Onurozcan.'

def connect_to_database():
    try:
        connection = mysql.connector.connect(host=host,
                                             database=database,
                                             user=user,
                                             password=password)
        if connection.is_connected():
            db_Info = connection.get_server_info()
            print("MySQL server version:", db_Info)
            return connection
    except Error as e:
        print("Error while connecting to MySQL", e)
        return None

def create_veli():
    soyad = fake.last_name()
    veli_id = str(fake.unique.random_int(min=1000000000, max=9999999999))
    veli_adi = fake.first_name()  # Bu satır düzeltildi
    return {
        'veli_id': veli_id,
        'veli_adi': veli_adi,
        'veli_soyadi': soyad,
        'veli_email': f"{veli_adi.lower()}.{soyad.lower()}.{veli_id}@gmail.com",
        'veli_telefon_no': '5' + fake.numerify(text='########')
    }

def create_student(veli):
    ogrenci_id = str(fake.unique.random_int(min=1000000000, max=9999999999))
    ogrenci_adi = fake.first_name()
    return {
        'ogrenci_id': ogrenci_id,
        'ogrenci_adi': ogrenci_adi,
        'ogrenci_soyadi': veli['veli_soyadi'],
        'ogrenci_email': f"{ogrenci_adi.lower()}.{veli['veli_soyadi'].lower()}.{ogrenci_id}@gmail.com",
        'ogrenci_telefon_no': '5' + fake.numerify(text='########'),
        'ogrenci_dogum_tarihi': fake.date_of_birth(minimum_age=13, maximum_age=18).strftime('%Y-%m-%d'),
        'ogrenci_adres': fake.address(),
        'ogrenci_kayit_tarihi': fake.date_between(start_date='-3y', end_date='today').strftime('%Y-%m-%d'),
        'ogrenci_aktif_mi': random.choice([True, False]),
        'ogrenci_veli_id': veli['veli_id']
    }

def create_calisan(is_pozisyonu):
    calisan_id = str(fake.unique.random_int(min=1000000000, max=9999999999))
    calisan_ad = fake.first_name()
    calisan_soyad = fake.last_name()
    return {
        'calisan_id': calisan_id,
        'calisan_ad': calisan_ad,
        'calisan_soyad': calisan_soyad,
        'calisan_email': f"{calisan_ad.lower()}.{calisan_soyad.lower()}.{calisan_id}@gmail.com",
        'calisan_telefon_no': '5' + fake.numerify(text='########'),
        'calisma_durumu': random.choice(['Tam Zamanlı', 'Yarı Zamanlı']),
        'dogum_tarihi': fake.date_of_birth(minimum_age=22, maximum_age=60).strftime('%Y-%m-%d'),
        'maas': round(random.uniform(3000.00, 10000.00), 2),
        'is_pozisyonu': is_pozisyonu
    }

def create_musaitlik_zamani():
    gunler = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma']
    secilen_gunler = random.sample(gunler, random.randint(0, len(gunler)))

    musaitlik_zamanlari = []
    for gun in secilen_gunler:
        baslangic_saati = random.randint(8, 17)
        bitis_saati = random.randint(baslangic_saati + 1, 18)
        baslangic_saati_str = f"{baslangic_saati:02d}:00"
        bitis_saati_str = f"{bitis_saati:02d}:00"
        musaitlik_zamanlari.append((gun, baslangic_saati_str, bitis_saati_str))

    return musaitlik_zamanlari

temizlik_malzemeleri = ["Temizlik Bezi", "Yer Temizleyici", "Cam Temizleyici", "Çöp Torbası", "Dezenfektan"]
kirtasiye_malzemeleri = ["Kalem", "Defter", "Silgi", "Cetvel", "Klips", "Post-it", "Kağıt"]

def create_malzemeler(temizlik_malzemeleri, kirtasiye_malzemeleri):
    malzemeler = []
    malzeme_sayac = 1

    for malzeme_adi in temizlik_malzemeleri:
        malzeme_id = f"tem{malzeme_sayac:03d}"
        malzemeler.append({
            'malzeme_id': malzeme_id,
            'miktar': random.randint(30, 100),
            'malzeme_adi': malzeme_adi,
            'minumum_stok_miktari': 10,
            'fiyat': round(random.uniform(5.00, 50.00), 2)
        })
        malzeme_sayac += 1

    for malzeme_adi in kirtasiye_malzemeleri:
        malzeme_id = f"kir{malzeme_sayac:03d}"
        malzemeler.append({
            'malzeme_id': malzeme_id,
            'miktar': random.randint(30, 100),
            'malzeme_adi': malzeme_adi,
            'minumum_stok_miktari': 10,
            'fiyat': round(random.uniform(5.00, 50.00), 2)
        })
        malzeme_sayac += 1

    return malzemeler

def create_ders(ders_id, ders_adi, ogretmen_id):
    return {
        'ders_id': ders_id,
        'ders_adi': ders_adi,
        'ders_saati': random.randint(1, 6),
        'talep': 0,
        'ogretmen_id': ogretmen_id
    }

def create_ogretmen(calisan):
    alanlar = ['Almanca', 'İngilizce', 'Satranç', 'Bilgisayar', 'Matematik']
    secilen_alan = random.choice(alanlar)
    return {
        'ogretmen_id': calisan['calisan_id'],
        'alan': secilen_alan
    }

def create_ders_malzemeleri(ders_id, malzemeler):
    secilen_malzemeler = random.sample(malzemeler, random.randint(1, len(malzemeler)))
    ders_malzemeleri = []
    for malzeme in secilen_malzemeler:
        if 'malzeme_id' in malzeme:
            ders_malzemeleri.append({
                'ders_id': ders_id,
                'malzeme_id': malzeme['malzeme_id']
            })
    return ders_malzemeleri
def insert_data(connection, query, data):
    try:
        cursor = connection.cursor()
        cursor.execute(query, data)
        connection.commit()
        print("Data inserted successfully")
    except Error as e:
        print("Error while inserting data into MySQL", e)

def insert_musaitlik_zamanlari(connection, musaitlik_zamanlari, id, tip):
    if tip == 'ogrenci':
        insert_query = """
        INSERT INTO ogrenci_musaitlik_zamani (gun, baslangic_saati, bitis_saati, ogrenci_id) 
        VALUES (%s, %s, %s, %s)
        """
    elif tip == 'ogretmen':
        insert_query = """
        INSERT INTO ogretmen_musaitlik_zamani (gun, baslangic_saati, bitis_saati, ogretmen_id) 
        VALUES (%s, %s, %s, %s)
        """
    else:
        raise ValueError("Tip sadece 'ogrenci' veya 'ogretmen' olabilir.")

    cursor = connection.cursor()
    for zaman in musaitlik_zamanlari:
        gun, baslangic_saati, bitis_saati = zaman
        cursor.execute(insert_query, (gun, baslangic_saati, bitis_saati, id))
    connection.commit()

def assign_courses_to_students(connection, student_id, courses):
    insert_query = """
    INSERT INTO ogrenci_alir_ders (ogrenci_id, ders_id) 
    VALUES (%s, %s)
    """

    update_ders_query = """
        UPDATE ders 
        Set ders.talep = (Select count(*) 
                            From ogrenci_alir_ders oa
                            where oa.ogrenci_id = %s)
        WHERE ders.ders_id = %s;
        """
    cursor = connection.cursor()
    for course in courses:
        cursor.execute(insert_query, (student_id, course['ders_id']))
        cursor.execute(update_ders_query, (student_id, course['ders_id']))
    connection.commit()
    cursor.close()

def get_students(connection):
    query = "SELECT ogrenci_id, ogrenci_aktif_mi FROM ogrenci"
    cursor = connection.cursor()
    cursor.execute(query)
    students = [{'ogrenci_id': row[0], 'ogrenci_aktif_mi': row[1]} for row in cursor.fetchall()]
    cursor.close()
    return students

def insert_gider(connection):
    try:
        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO gider (tutar, gider_turu, tarih) 
            SELECT SUM(calisan.maas), 'maaş', '2023-11-24' FROM calisan
        """)

        cursor.execute("""
            INSERT INTO gider (tutar, gider_turu, tarih) 
            SELECT 100000, 'kira', '2023-11-27' FROM dual
        """)

        cursor.execute("""
            INSERT INTO gider (tutar, gider_turu, tarih) 
            SELECT SUM(miktar * fiyat), 'temizlik gideri', '2023-11-27' FROM malzeme WHERE malzeme_id LIKE 'tem%'
        """)

        cursor.execute("""
            INSERT INTO gider (tutar, gider_turu, tarih) 
            SELECT SUM(miktar * fiyat), 'kırtasiye gideri', '2023-11-28' FROM malzeme WHERE malzeme_id LIKE 'kir%'
        """)

        connection.commit()
    except Error as e:
        print("Gider eklerken hata oluştu:", e)

# Veritabanı bağlantısını aç
connection = connect_to_database()

def get_courses(connection):
    query = "SELECT ders_id FROM ders"
    cursor = connection.cursor()
    cursor.execute(query)
    courses = [{'ders_id': row[0]} for row in cursor.fetchall()]
    cursor.close()
    return courses

if __name__ == '__main__':
    connection = connect_to_database()
    if connection:
        try:
            veliler = [create_veli() for _ in range(500)]
            for veli in veliler:
                insert_query = "INSERT INTO veli (veli_id, veli_adi, veli_soyadi, veli_email, veli_telefon_no) VALUES (%s, %s, %s, %s, %s)"
                insert_data(connection, insert_query, (
                    veli['veli_id'], veli['veli_adi'], veli['veli_soyadi'], veli['veli_email'], veli['veli_telefon_no']))

            ogrenciler = [create_student(veli) for veli in veliler]
            for ogrenci in ogrenciler:
                ogrenci_musaitlik = create_musaitlik_zamani()
                insert_query = "INSERT INTO ogrenci (ogrenci_id, ogrenci_adi, ogrenci_soyadi, ogrenci_email, ogrenci_telefon_no, ogrenci_dogum_tarihi, ogrenci_adres, ogrenci_kayit_tarihi, ogrenci_aktif_mi, ogrenci_veli_id) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
                insert_data(connection, insert_query, (ogrenci['ogrenci_id'], ogrenci['ogrenci_adi'], ogrenci['ogrenci_soyadi'], ogrenci['ogrenci_email'], ogrenci['ogrenci_telefon_no'], ogrenci['ogrenci_dogum_tarihi'], ogrenci['ogrenci_adres'], ogrenci['ogrenci_kayit_tarihi'], ogrenci['ogrenci_aktif_mi'], ogrenci['ogrenci_veli_id']))

            ogretmenler = [create_calisan('Öğretmen') for _ in range(10)]
            temizlik_gorevlileri = [create_calisan('Temizlik Görevlisi') for _ in range(5)]
            idari_personeller = [create_calisan('İdari Personel') for _ in range(5)]

            temizlik_malzeme_sayisi = 30
            kirtasiye_malzeme_sayisi = 30

            alan_dersleri = {
                'Almanca': ['ALM1', 'ALM2'],
                'İngilizce': ['ING1', 'ING2'],
                'Satranç': ['SAT1', 'SAT2'],
                'Bilgisayar': ['RK1', 'RK2'],
                'Matematik': ['MAT1', 'MAT2']
            }

            malzemeler = create_malzemeler(temizlik_malzemeleri, kirtasiye_malzemeleri)
            for malzeme in malzemeler:
                insert_query = "INSERT INTO malzeme (malzeme_id, miktar, malzeme_adi, minumum_stok_miktari, fiyat) VALUES (%s, %s, %s, %s, %s)"
                insert_data(connection, insert_query, (
                    malzeme['malzeme_id'], malzeme['miktar'], malzeme['malzeme_adi'], malzeme['minumum_stok_miktari'], malzeme['fiyat']))

            tum_calisanlar = ogretmenler + temizlik_gorevlileri + idari_personeller
            for calisan in tum_calisanlar:
                insert_query = "INSERT INTO calisan (calisan_id, calisan_ad, calisan_soyad, calisan_email, calisan_telefon_no, calisma_durumu, dogum_tarihi, maas, is_pozisyonu) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
                insert_data(connection, insert_query, (
                    calisan['calisan_id'], calisan['calisan_ad'], calisan['calisan_soyad'], calisan['calisan_email'],
                    calisan['calisan_telefon_no'], calisan['calisma_durumu'], calisan['dogum_tarihi'], calisan['maas'], calisan['is_pozisyonu']))

            for ogretmen in ogretmenler:
                ogretmen_musaitlik = create_musaitlik_zamani()
                insert_query_ogretmen = "INSERT INTO ogretmen (ogretmen_id) VALUES (%s)"
                insert_data(connection, insert_query_ogretmen, (ogretmen['calisan_id'],))

                ders_idleri = ['MAT1', 'MAT2', 'ING1', 'ING2', 'ALM1', 'ALM2', 'RK1', 'RK2']
                ders_adlari = ['Matematik 1', 'Matematik 2', 'Ingilizce 1', 'Ingilizce 2', 'Almanca 1', 'Almanca 2',
                               'Robotik Kodlama 1', 'Robotik Kodlama 2']
                for ders_id, ders_adi in zip(ders_idleri, ders_adlari):
                    secilen_ogretmen = random.choice(ogretmenler)
                    ders = create_ders(ders_id, ders_adi, secilen_ogretmen['calisan_id'])
                    insert_query_ders = "INSERT INTO ders (ders_id, ders_adi, ders_saati, talep, ogretmen_id) VALUES (%s, %s, %s, %s, %s)"
                    insert_data(connection, insert_query_ders, (ders['ders_id'], ders['ders_adi'], ders['ders_saati'], ders['talep'], ders['ogretmen_id']))

                ogretmen_dersleri = {ogretmen['calisan_id']: [] for ogretmen in ogretmenler}
                for ders_id, ders_adi in zip(ders_idleri, ders_adlari):
                    secilen_ogretmen = random.choice(ogretmenler)
                    ders = create_ders(ders_id, ders_adi, secilen_ogretmen['calisan_id'])
                    ogretmen_dersleri[secilen_ogretmen['calisan_id']].append(ders['ders_adi'])

            for _ in range(10):
                ogretmen = create_ogretmen(calisan)
                insert_query = "INSERT INTO ogretmen (ogretmen_id, Alani) VALUES (%s, %s)"
                insert_data(connection, insert_query, (ogretmen['ogretmen_id'], ogretmen['alan']))

                for ders_id in alan_dersleri[ogretmen['alan']]:
                    ders = create_ders(ders_id, ogretmen['alan'], ogretmen['ogretmen_id'])
                    insert_query_ders = "INSERT INTO ders (ders_id, ders_adi, ders_saati, talep, ogretmen_id) VALUES (%s, %s, %s, %s, %s)"
                    insert_data(connection, insert_query_ders, (
                        ders['ders_id'], ders['ders_adi'], ders['ders_saati'], ders['talep'], ders['ogretmen_id']))

                    ders_malzemeleri = create_ders_malzemeleri(ders_id, kirtasiye_malzemeleri)
                    for ders_malzeme in ders_malzemeleri:
                        insert_query_ders_malzeme = "INSERT INTO ders_malzemeleri (ders_id, malzeme_id) VALUES (%s, %s)"
                        insert_data(connection, insert_query_ders_malzeme,
                                    (ders_malzeme['ders_id'], ders_malzeme['malzeme_id']))

            for temizlikci in temizlik_gorevlileri:
                insert_query = "INSERT INTO temizlik_gorevlisi (temizlik_gorevlisi_id) VALUES (%s)"
                insert_data(connection, insert_query, (temizlikci['calisan_id'],))

            idari_pozisyonlar = ["Müdür", "Yardımcı", "Yardımcı", "Okul Aile Birliği", "Vakıf Başkanı"]
            for pozisyon in idari_pozisyonlar:
                idari_personel = create_calisan('İdari Personel')  # İdari personel için genel pozisyon
                insert_query_calisan = "INSERT INTO calisan (calisan_id, calisan_ad, calisan_soyad, calisan_email, calisan_telefon_no, calisma_durumu, dogum_tarihi, maas, is_pozisyonu) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
                insert_data(connection, insert_query_calisan, (
                    idari_personel['calisan_id'], idari_personel['calisan_ad'], idari_personel['calisan_soyad'],
                    idari_personel['calisan_email'],
                    idari_personel['calisan_telefon_no'], idari_personel['calisma_durumu'],
                    idari_personel['dogum_tarihi'], idari_personel['maas'],
                    'İdari Personel'))  # Burada 'İdari Personel' olarak belirtin
                insert_query_idari = "INSERT INTO idari_personel (idari_personel_id, pozisyon) VALUES (%s, %s)"
                insert_data(connection, insert_query_idari,
                            (idari_personel['calisan_id'], pozisyon))  # Burada özel pozisyonu belirtin

            for ogrenci in ogrenciler:
                if ogrenci['ogrenci_aktif_mi']:
                    ogrenci_musaitlik = create_musaitlik_zamani()
                    insert_musaitlik_zamanlari(connection, ogrenci_musaitlik, ogrenci['ogrenci_id'], 'ogrenci')

            for ogretmen in ogretmenler:
                ogretmen_musaitlik = create_musaitlik_zamani()
                insert_musaitlik_zamanlari(connection, ogretmen_musaitlik, ogretmen['calisan_id'], 'ogretmen')

            students = get_students(connection)
            courses = get_courses(connection)

            for student in students:
                if student['ogrenci_aktif_mi']:
                    num_courses = random.randint(0, len(courses))
                    selected_courses = random.sample(courses, num_courses)
                    assign_courses_to_students(connection, student['ogrenci_id'], selected_courses)

            insert_gider(connection)

        finally:
            connection.close()