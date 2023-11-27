from faker import Faker
import random
import mysql.connector
from mysql.connector import Error
import datetime

fake = Faker()

host = 'localhost'
database = 'okul'
user = 'root'
password = '7201'

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
    baslangic = datetime.datetime.strptime("08:00", "%H:%M")
    bitis = baslangic + datetime.timedelta(minutes=40)
    return baslangic.time(), bitis.time()

temizlik_malzemeleri = ["Temizlik Bezi", "Yer Temizleyici", "Cam Temizleyici", "Çöp Torbası", "Dezenfektan"]
kirtasiye_malzemeleri = ["Kalem", "Defter", "Silgi", "Cetvel", "Klips", "Post-it", "Kağıt"]

def create_malzeme(malzeme_sayac, malzeme_tipi):
    if malzeme_tipi == "temizlik":
        malzeme_adi = random.choice(temizlik_malzemeleri)
        malzeme_id = f"tem{malzeme_sayac:03d}"
    elif malzeme_tipi == "kirtasiye":
        malzeme_adi = random.choice(kirtasiye_malzemeleri)
        malzeme_id = f"kir{malzeme_sayac:03d}"

    return {
        'malzeme_id': malzeme_id,
        'miktar': random.randint(30, 100),
        'malzeme_adi': malzeme_adi,
        'minumum_stok_miktari': 10,
        'fiyat': round(random.uniform(5.00, 50.00), 2)
    }

def create_ders(ders_id, ders_adi, ogretmen_id):
    return {
        'ders_id': ders_id,
        'ders_adi': ders_adi,
        'ders_saati': random.randint(1, 6),
        'talep': 0,
        'ogretmen_id': ogretmen_id
    }

def insert_data(connection, query, data):
    try:
        cursor = connection.cursor()
        cursor.execute(query, data)
        connection.commit()
        print("Data inserted successfully")
    except Error as e:
        print("Error while inserting data into MySQL", e)

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
                baslangic_saati, bitis_saati = create_musaitlik_zamani()
                insert_query = "INSERT INTO ogrenci (ogrenci_id, ogrenci_adi, ogrenci_soyadi, ogrenci_email, ogrenci_telefon_no, ogrenci_dogum_tarihi, ogrenci_adres, ogrenci_kayit_tarihi, ogrenci_aktif_mi, ogrenci_veli_id) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
                insert_data(connection, insert_query, (ogrenci['ogrenci_id'], ogrenci['ogrenci_adi'], ogrenci['ogrenci_soyadi'], ogrenci['ogrenci_email'], ogrenci['ogrenci_telefon_no'], ogrenci['ogrenci_dogum_tarihi'], ogrenci['ogrenci_adres'], ogrenci['ogrenci_kayit_tarihi'], ogrenci['ogrenci_aktif_mi'], ogrenci['ogrenci_veli_id']))

            ogretmenler = [create_calisan('Öğretmen') for _ in range(10)]
            temizlik_gorevlileri = [create_calisan('Temizlik Görevlisi') for _ in range(5)]
            idari_personeller = [create_calisan('İdari Personel') for _ in range(5)]

            temizlik_malzeme_sayisi = 30
            kirtasiye_malzeme_sayisi = 30

            for i in range(1, temizlik_malzeme_sayisi + 1):
                malzeme = create_malzeme(i, "temizlik")
                insert_query = "INSERT INTO malzeme (malzeme_id, miktar, malzeme_adi, minumum_stok_miktari, fiyat) VALUES (%s, %s, %s, %s, %s)"
                insert_data(connection, insert_query, (
                    malzeme['malzeme_id'], malzeme['miktar'], malzeme['malzeme_adi'], malzeme['minumum_stok_miktari'],
                    malzeme['fiyat']))

            for i in range(1, kirtasiye_malzeme_sayisi + 1):
                malzeme = create_malzeme(i, "kirtasiye")
                insert_query = "INSERT INTO malzeme (malzeme_id, miktar, malzeme_adi, minumum_stok_miktari, fiyat) VALUES (%s, %s, %s, %s, %s)"
                insert_data(connection, insert_query, (
                    malzeme['malzeme_id'], malzeme['miktar'], malzeme['malzeme_adi'], malzeme['minumum_stok_miktari'],
                    malzeme['fiyat']))

            tum_calisanlar = ogretmenler + temizlik_gorevlileri + idari_personeller
            for calisan in tum_calisanlar:
                insert_query = "INSERT INTO calisan (calisan_id, calisan_ad, calisan_soyad, calisan_email, calisan_telefon_no, calisma_durumu, dogum_tarihi, maas, is_pozisyonu) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
                insert_data(connection, insert_query, (
                    calisan['calisan_id'], calisan['calisan_ad'], calisan['calisan_soyad'], calisan['calisan_email'],
                    calisan['calisan_telefon_no'], calisan['calisma_durumu'], calisan['dogum_tarihi'], calisan['maas'],
                    calisan['is_pozisyonu']))

            for ogretmen in ogretmenler:
                baslangic_saati, bitis_saati = create_musaitlik_zamani()
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

                    update_query = "UPDATE ogretmen SET verdigi_ders = %s WHERE ogretmen_id = %s"
                    insert_data(connection, update_query, (ders['ders_adi'], secilen_ogretmen['calisan_id']))

                ogretmen_dersleri = {ogretmen['calisan_id']: [] for ogretmen in ogretmenler}
                for ders_id, ders_adi in zip(ders_idleri, ders_adlari):
                    secilen_ogretmen = random.choice(ogretmenler)
                    ders = create_ders(ders_id, ders_adi, secilen_ogretmen['calisan_id'])
                    ogretmen_dersleri[secilen_ogretmen['calisan_id']].append(ders['ders_adi'])

                for ogretmen_id, ders_listesi in ogretmen_dersleri.items():
                    if ders_listesi:
                        secilen_ders = random.choice(ders_listesi)
                        update_query = "UPDATE ogretmen SET verdigi_ders = %s WHERE ogretmen_id = %s"
                        insert_data(connection, update_query, (secilen_ders, ogretmen_id))

            for temizlikci in temizlik_gorevlileri:
                insert_query = "INSERT INTO temizlik_gorevlisi (temizlik_gorevlisi_id) VALUES (%s)"
                insert_data(connection, insert_query, (temizlikci['calisan_id'],))

            idari_pozisyonlar = ["Müdür", "Yardımcı", "Yardımcı", "Okul Aile Birliği", "Vakıf Başkanı"]
            idari_personeller = [create_calisan(pozisyon) for pozisyon in idari_pozisyonlar]
            for idari, pozisyon in zip(idari_personeller, idari_pozisyonlar):
                insert_query_calisan = "INSERT INTO calisan (calisan_id, calisan_ad, calisan_soyad, calisan_email, calisan_telefon_no, calisma_durumu, dogum_tarihi, maas, is_pozisyonu) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
                insert_data(connection, insert_query_calisan, (
                    idari['calisan_id'], idari['calisan_ad'], idari['calisan_soyad'], idari['calisan_email'],
                    idari['calisan_telefon_no'], idari['calisma_durumu'], idari['dogum_tarihi'], idari['maas'],
                    pozisyon))
                insert_query_idari = "INSERT INTO idari_personel (idari_personel_id, pozisyon) VALUES (%s, %s)"
                insert_data(connection, insert_query_idari, (idari['calisan_id'], pozisyon))

        finally:
            connection.close()