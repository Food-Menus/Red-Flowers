
function loadComponents() {

/*######################################  Header  ##############################################*/

        const HeaderElement = document.getElementById('Header');
        if (HeaderElement) {
            HeaderElement.innerHTML = `
                <header class="header">
                    <div class="navbar-top">
                        <button class="sidebar-toggle" aria-label="Toggle sidebar">
                            <i class="fas fa-bars"></i>
                        </button>
                        <div class="logo">
                            <h1>Red Flowers</h1>
                        </div>
                    </div>
                    <nav class="main-nav">
                        <button class="menu-toggle" aria-label="Toggle navigation menu">
                            <i class="fas fa-bars"></i>
                        </button>
                        <ul class="nav-links">
                            <li><a href="index.html" class="active">الرئيسية</a></li>
                            <li><a href="products.html">باقاتنا</a></li>
                            <li><a href="about.html">عن Red Flowers</a></li>
                            <li><a href="order.html">اطلب باقتك</a></li>
                        </ul>
                    </nav>
                </header>
            `;
        }

/*######################################  Sidebar  ##############################################*/

        const SidebarElement = document.getElementById('Sidebar');
        if (SidebarElement) {
            SidebarElement.innerHTML = `
                <aside class="sidebar">
                    <h2>أقسام الزهور</h2>
                    <ul>
                        <li><a href="#">باقات الورد الطبيعي</a></li>
                        <li><a href="#">ورود المناسبات الخاصة</a></li>
                        <li><a href="#">نباتات الزينة</a></li>
                        <li><a href="#">هدايا مع الورد</a></li>
                        <li><a href="#">صناديق الورد الفاخرة</a></li>
                    </ul>
                    <div class="promo-box">
                        <h3>عروض حصرية!</h3>
                        <p>اكتشف باقاتنا الجديدة بأسعار لا تُصدق.</p>
                        <button>تسوق الآن</button>
                    </div>
                </aside>
            `;
        }
/*######################################  Footer  ##############################################*/

        const FooterElement = document.getElementById('Footer');
        if (FooterElement) {
            FooterElement.innerHTML = `
                <footer class="footer">
                    <p>&copy; 2025 Red Flowers. جميع الحقوق محفوظة.</p>
                    <div class="social-links">
                        <a href="#"><i class="fab fa-facebook-f"></i></a>
                        <a href="#"><i class="fab fa-instagram"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                    </div>
                </footer>
            `;
        }
/*####################################################################################################*/

}

/*####################################################################################################*/
/*###############################  load Products suggestions  ########################################*/
    function loadProducts() {
        const sheetID = '1CK5wjrpnDTkriEfs8XRo5Sgnq07HHKsyO1pGU_tQguU';
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json`;

        fetch(sheetUrl)
            .then(res => res.text())
            .then(text => {
                const jsonData = JSON.parse(text.substr(47).slice(0, -2));
                const rows = jsonData.table.rows;
                
                // تحويل البيانات إلى مصفوفة منتجات
                const products = rows.map((row, index) => {
                    if (index === 0) return null;
                    const cells = row.c;
                    return {
                        id: cells[0]?.v || '',
                        name: cells[1]?.v || '',
                        details: cells[2]?.v || '',
                        price: cells[3]?.v || '0',
                        type: cells[4]?.v || '',
                        image1: cells[5]?.v || '',
                        image2: cells[6]?.v || ''
                    };
                }).filter(product => product !== null);

                products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                const cheapestProducts = products.slice(0, 2);
                const expensiveProducts = products.slice(-2);
                const selectedProducts = [...cheapestProducts, ...expensiveProducts];

                const productContainer = document.getElementById('product-container');
                if (productContainer) {
                    selectedProducts.forEach(product => {
                        const productItem = document.createElement('a');
                        productItem.className = 'product-item';
                        productItem.href = `product-details.html?id=${product.id}`;
                        
                        productItem.innerHTML = `
                            <img src="${product.image1}" data-hover-src="${product.image2}" alt="${product.name}">
                            <h3>${product.name}</h3>
                            <p>${product.details}</p>
                            <span>$${product.price}</span>
                        `;
                        
                        productContainer.appendChild(productItem);
                    });

                    // إضافة تأثير تغيير الصورة
                    document.querySelectorAll('.product-item img').forEach(img => {
                        const hoverSrc = img.getAttribute('data-hover-src');
                        if (hoverSrc) {
                            const hoverImg = new Image();
                            hoverImg.src = hoverSrc;
                            hoverImg.style.position = 'absolute';
                            hoverImg.style.top = '0';
                            hoverImg.style.left = '0';
                            hoverImg.style.opacity = '0';
                            hoverImg.style.transition = 'opacity 0.5s ease';
                            img.parentNode.insertBefore(hoverImg, img.nextSibling);

                            img.parentElement.addEventListener('mouseenter', () => {
                                img.style.opacity = '0';
                                hoverImg.style.opacity = '1';
                            });

                            img.parentElement.addEventListener('mouseleave', () => {
                                img.style.opacity = '1';
                                hoverImg.style.opacity = '0';
                            });
                        }
                    });
                }
            })
            .catch(error => {
                console.error('حدث خطأ أثناء جلب البيانات:', error);
                const productContainer = document.getElementById('product-container');
                if (productContainer) {
                    productContainer.innerHTML = '<p>عذرًا، حدث خطأ أثناء تحميل المنتجات.</p>';
                }
            });
    }
/*####################################################################################################*/
/*###################################  load Data Products  ###########################################*/
    function loadDataProducts() {
  
        const sheetID = '1CK5wjrpnDTkriEfs8XRo5Sgnq07HHKsyO1pGU_tQguU'; // ID من رابط Google Sheets
        const baseURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json`;

        // دالة لجلب البيانات من Google Sheets
        async function fetchProducts() {
            const response = await fetch(baseURL);
            const data = await response.text();
            const jsonData = JSON.parse(data.substr(47).slice(0, -2)); // معالجة البيانات

            return jsonData.table.rows.map(row => {
                return {
                    id: row.c[0].v,
                    name: row.c[1].v,
                    details: row.c[2].v,
                    price: row.c[3].v,
                    type: row.c[4].v, // إضافة نوع المنتج
                    image1: row.c[5].v,
                    image2: row.c[6].v
                };
            });
        }

        // دالة لعرض البيانات في بطاقات
        async function displayProducts() {
            const products = await fetchProducts();
            const productGrid = document.getElementById("productGrid");
            productGrid.innerHTML = ""; // مسح البطاقات الحالية

            const categoryFilter = document.getElementById("category-filter");
            const searchBar = document.getElementById("search-bar");

            // تصفية المنتجات عند تغيير الفلتر أو البحث
            function filterProducts() {
                const searchTerm = searchBar.value.toLowerCase();
                const selectedCategory = categoryFilter.value;

                const filteredProducts = products.filter(product => {
                    const matchesCategory = selectedCategory === "all" || product.type === selectedCategory;
                    const matchesSearch = product.name.toLowerCase().includes(searchTerm) || product.details.toLowerCase().includes(searchTerm);
                    return matchesCategory && matchesSearch;
                });

                // عرض المنتجات المصفاة
                productGrid.innerHTML = ""; // مسح البطاقات الحالية
                filteredProducts.forEach(product => {
                    const card = document.createElement("a");
                    card.href = `product-details.html?id=${product.id}`;
                    card.className = "product-item";
                    card.setAttribute("data-category", product.type);

                    card.innerHTML = `
                        <div class="product-image-container">
                            <img class="main-image" src="${product.image1}" alt="${product.name}">
                            <img class="hover-image" src="${product.image2}" alt="${product.name}">
                        </div>
                        <h3>${product.name}</h3>
                        <p>${product.details}</p>
                        <span>$${product.price}</span>
                    `;
                    productGrid.appendChild(card);
                });
            }

            // عرض جميع المنتجات عند تحميل الصفحة
            filterProducts();

            // إضافة أحداث على الفلتر والبحث
            categoryFilter.addEventListener("change", filterProducts);
            searchBar.addEventListener("input", filterProducts);
        }
         // عرض المنتجات عند تحميل الصفحة
        displayProducts();
    }

/*####################################################################################################*/
/*####################################################################################################*/

    // حدث تحميل الصفحة
    document.addEventListener('DOMContentLoaded', function() {
        // تحميل المكونات
        loadComponents();
        
        // تحميل الباقات المقترحه
        loadProducts();
        
        // تحميل الباقات
        loadDataProducts();
        
        // إعداد السلايدر
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        
        function showSlide(n) {
            slides.forEach(slide => slide.classList.remove('active'));
            currentSlide = (n + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        setInterval(nextSlide, 3000);
        
        document.addEventListener('click', function(event) {
            const sidebar = document.querySelector('.sidebar');
            const sidebarToggle = document.querySelector('.sidebar-toggle');
            
            // إذا كان النقر خارج السايدبار وخارج زر التفعيل وكانت السايدبار مفتوحة
            if (!sidebar.contains(event.target) && 
                event.target !== sidebarToggle && 
                !sidebarToggle.contains(event.target) && 
                sidebar.classList.contains('open')) {
                
                sidebar.classList.remove('open');
            }
        });
        // إعداد السايدبار
        document.querySelector('.sidebar-toggle')?.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('open');
        });

        // إعداد القائمة الرئيسية
        document.querySelector('.menu-toggle')?.addEventListener('click', function() {
            document.querySelector('.nav-links').classList.toggle('open');
        });

        // إخفاء الـ Preloader
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            setTimeout(function() {
                preloader.classList.add('fade-out');
                setTimeout(function() {
                    preloader.style.display = 'none';
                }, 500);
            }, 500);
        }
    });