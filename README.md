# Hasan Aybaba Anadolu Lisesi - Şairlerimiz Karekod Projesi
## Ücretsiz ve Uzun Ömürlü Barındırma (Hosting) Rehberi

Eğer okul sunucusuna (hasanaybaba.meb.k12.tr) erişiminiz yoksa, bu projeyi **tamamen ücretsiz (0 TL)**, **reklamsız** ve **ömür boyu kapanmayacak** şekilde yayınlayabileceğiniz en popüler iki yöntemi aşağıda bulabilirsiniz.

---

## ⚡ Yöntem 1: GitHub Pages (En Önerilen ve En Hızlı Yöntem)

Bizim hazırladığımız şık arayüzü, aramalı şair kataloğunu ve **tek tıkla 30 karekodu yazdıran basım panelini** aynen korumak için en iyi yöntemdir. Microsoft altyapısı kullandığı için asla kapanmaz ve ömürlüktür.

### Adım 1: Ücretsiz Hesap ve Depo (Repository) Oluşturma
1. [GitHub.com](https://github.com/) sitesine girin ve tamamen ücretsiz bir üyelik oluşturun.
2. Sağ üstteki yeşil **"New"** butonuna basarak yeni bir depo (klasör) oluşturun:
   * **Repository name:** `sairler` yazın.
   * **Public** seçeneğinin işaretli olduğundan emin olun (dosyaların dışarıya açılması için şarttır).
   * En alttaki **"Create repository"** butonuna tıklayın.

### Adım 2: Dosyaları Yükleme
1. Açılan sayfada **"uploading an existing file"** linkine tıklayın.
2. Bilgisayarınızdaki `C:\Project\Qr\` klasörü içindeki tüm dosyaları (`index.html`, `style.css`, `app.js`, `poets.json` ve 30 adet PDF dosyanızın bulunduğu `pdfs/` klasörünü) sürükleyip buraya bırakın.
3. Sayfanın altındaki yeşil **"Commit changes"** butonuna basın. (Yükleme boyuta göre 1-2 dakika sürebilir).

### Adım 3: Yayına Alma (GitHub Pages Etkinleştirme)
1. Repository sayfanızın sağ üstündeki **"Settings"** (Ayarlar) sekmesine girin.
2. Sol menüden **"Pages"** seçeneğine tıklayın.
3. **Build and deployment** başlığı altındaki **Branch** ayarını `None` yerine `main` (veya `master`) yapın, yanındaki klasör ayarını `/ (root)` olarak bırakıp **"Save"** butonuna basın.
4. Sayfayı yenilediğinizde en üstte sitenizin ömürlük adresi görünecektir. Örn:
   `https://[kullanici-adiniz].github.io/sairler/`
5. **Karekod Link Uyumu:** Yazılımımız akıllı algılayıcıya sahiptir. Siteniz GitHub Pages'e yüklendiğinde, karekod linkleri otomatik olarak kendini ayarlar. Yönetim paneline girip hiçbir şey yapmadan doğrudan "Toplu Yazdır" diyerek karekodlarınızı çıkarabilirsiniz!

---

## 📝 Yöntem 2: Google Sites veya Blogger + Google Drive (Görsel Alternatif)

Eğer kod dosyalarıyla hiç uğraşmak istemiyorsanız, Google'ın ücretsiz hizmetlerini kullanarak klasik bir blog/okul sayfası oluşturabilirsiniz:

### Adım 1: PDF'leri Google Drive'a Yükleme
1. Okula veya şahsınıza ait bir Gmail hesabı ile Google Drive'a girin.
2. `Sairlerimiz` adında bir klasör oluşturun ve 30 adet PDF dosyasını buraya yükleyin.
3. Klasöre sağ tıklayıp **"Paylaş" -> "Bağlantıyı kopyala"** deyin ve genel erişimi **"Bağlantıya sahip olan herkes görüntüleyebilir"** olarak ayarlayın.

### Adım 2: Blog veya Web Sayfası Oluşturma
* **Google Sites (Önerilen):** [sites.google.com](https://sites.google.com/) adresine gidin.
  1. Boş bir şablon seçerek okulunuza yakışır bir tasarım yapın.
  2. Her şair için bir alt sayfa veya bölüm oluşturup, Google Drive'daki ilgili PDF dosyasını sayfaya gömün (Insert > Drive kısmından doğrudan PDF'i seçebilirsiniz).
  3. Sitenizi yayınlayın.
* **Blogger:** [blogger.com](https://www.blogger.com/) adresine gidin.
  1. Ücretsiz bir blog oluşturun (Örn: `hasanaybabasairler.blogspot.com`).
  2. Her şair için bir blog yazısı (Post) paylaşın. Yazının içerisine şairin bilgilerini ekleyip, Google Drive'daki PDF bağlantısını "Dosyayı İndirmek İçin Tıklayın" şeklinde köprüleyin.

### Bu Yöntemin Dezavantajı:
* Bu yöntemde 30 şair için tek tek Blogger yazısı açmanız, bunların linklerini tek tek kopyalayıp ücretsiz karekod sitelerinde 30 kez karekod üretip çıktı almanız gerekir. **Yöntem 1 (GitHub Pages)** ise bu 30 karekodu tek tıkla otomatik ürettiği için çok daha pratiktir.
