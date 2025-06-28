const fake_comments = [
    { text: "این محصول عالیه!", product_id: "1" },
    { text: "واقعا محصول خوبی بود!", product_id: "1" },
    { text: "من عاشق این کالا شدم، شدیداً توصیه می‌کنم.", product_id: "1" },
    { text: "از محصول راضی نبودم.", product_id: "1" },
    { text: "کیفیت افتضاح بود، نخرید!", product_id: "1" },
    { text: "بدترین خریدی بود که داشتم.", product_id: "1" },
    { text: "کیفیت فوق‌العاده و ارسال سریع!", product_id: "1" },
    { text: "هم کیفیت بالا بود هم تحویل سریع.", product_id: "1" },
    { text: "از رنگش خوشم نیومد.", product_id: "1" },
    { text: "رنگ با چیزی که انتظار داشتم فرق داشت.", product_id: "1" },
    { text: "تحویل سریع و بسته‌بندی خوب.", product_id: "1" },
    { text: "محصول معمولی بود، چیز خاصی نداشت.", product_id: "1" },
    { text: "بد نبود ولی می‌تونست بهتر باشه.", product_id: "1" },
    { text: "عالی بود! دوباره می‌خرمش.", product_id: "1" },
    { text: "حتماً دوباره این محصول رو می‌خرم!", product_id: "1" },
    { text: "تجربه بدی بود، پشتیبانی مشتری بی‌ادب بود.", product_id: "1" },
    { text: "پشتیبانی خیلی ضعیف بود.", product_id: "1" },
    { text: "خیلی دوسش داشتم!", product_id: "1" },
    { text: "ارزش خرید نداشت.", product_id: "1" },
    { text: "سایز مناسب و جنس عالی.", product_id: "1" },
    { text: "هم جنس خوب بود هم اندازه مناسب.", product_id: "1" },
    { text: "بسته‌بندی خیلی ضعیف و آسیب‌دیده بود.", product_id: "1" },
    { text: "محصول فیک بود و اصلاً اصل نبود.", product_id: "1" },
    { text: "زمان ارسال طولانی‌تر از انتظارم بود.", product_id: "1" },
    { text: "اصلاً با عکس سایت هم‌خوانی نداشت.", product_id: "1" },
    { text: "ظاهر محصول با چیزی که تو تصویر بود فرق داشت.", product_id: "1" },
    { text: "محصول نو نبود، انگار قبلاً باز شده بود!", product_id: "1" },
    { text: "ارسال سریع بود ولی بسته‌بندی ضعیف بود.", product_id: "1" },
    { text: "پشتیبانی با احترام پاسخ داد، ممنونم.", product_id: "1" },
    { text: "قیمت بالا ولی کیفیت پایین.", product_id: "1" },
    { text: "برای مصرف روزمره خوبه.", product_id: "1" },

    { text: "طراحی این محصول واقعاً خاصه.", product_id: "2" },
    { text: "از خریدم خیلی راضی‌ام.", product_id: "2" },
    { text: "برای هدیه دادن عالیه.", product_id: "2" },
    { text: "کاش زودتر می‌خریدم!", product_id: "2" },
    { text: "کاملاً مطابق با عکس بود.", product_id: "2" },
    { text: "چند روزه دارم استفاده می‌کنم، خیلی خوبه.", product_id: "2" },
    { text: "بسته‌بندی خیلی شیکی داشت.", product_id: "2" },
    { text: "رنگش دقیقاً همونی بود که می‌خواستم.", product_id: "2" },
    { text: "نسبت به قیمتش ارزش داره.", product_id: "2" },
    { text: "نظرم رو جلب نکرد، معمولیه.", product_id: "2" },
    { text: "از کیفیتش راضی نیستم، زود خراب شد.", product_id: "2" },
    { text: "ارسال خیلی سریع انجام شد، ممنون.", product_id: "2" },
    { text: "محصول استفاده شده بود و بو می‌داد!", product_id: "2" },
    { text: "پشتیبانی خیلی کمکم کرد برای انتخاب محصول.", product_id: "2" },
    { text: "اندازه‌اش کوچیک‌تر از انتظارم بود.", product_id: "2" },
    { text: "ظاهر زیبایی داره ولی جنسش معمولیه.", product_id: "2" },
    { text: "فکر می‌کردم ساخت ایران باشه ولی چینیه!", product_id: "2" },
    { text: "نسبت به رقباش خیلی بهتره.", product_id: "2" },
    { text: "بعد از چند روز استفاده خراب شد.", product_id: "2" },
    { text: "ارسال دیر بود ولی خود محصول خوبه.", product_id: "2" },
];

async function sendComment(comment) {
    try {
        const response = await fetch("http://localhost:8000/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(comment),
        });

        const result = await response.json();
        console.log("Response:", result);

    } catch (error) {
        console.error("Failed to send comment:", error);
    }
}

async function run() {
    for (const comment of fake_comments) {
        await sendComment(comment);
        await new Promise(res => setTimeout(res, 6000));
    }
}

run();
