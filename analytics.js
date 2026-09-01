(() => {
  const SUPABASE_URL =
    "https://ltuyfewachzbazunuxmd.supabase.co";

  const SUPABASE_KEY =
    "sb_publishable_UL-3si425vxRnBAGcgtDJA_Xw5VB3yN";

  // معرف عشوائي لكل متصفح
  function makeUUID() {
    if (crypto?.randomUUID) {
      return crypto.randomUUID();
    }

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 3) | 8;
        return v.toString(16);
      }
    );
  }

  // نفس الشخص ما ينحسب كل مرة يغير الصفحة
  let visitorId = localStorage.getItem("lahzaVisitorId");

  if (!visitorId) {
    visitorId = makeUUID();
    localStorage.setItem("lahzaVisitorId", visitorId);
  }

  async function rpc(name, body = {}) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/${name}`,
      {
        method: "POST",

        headers: {
          apikey: SUPABASE_KEY,
          Authorization: "Bearer " + SUPABASE_KEY,
          "Content-Type": "application/json"
        },

        body: JSON.stringify(body),

        keepalive: true
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const text = await response.text();

    return text ? JSON.parse(text) : null;
  }

  // يقول للسيرفر إن الشخص للحين داخل الموقع
  async function heartbeat() {
    try {
      await rpc(
        "heartbeat_site_visitor",
        {
          p_visitor_id: visitorId
        }
      );

      window.dispatchEvent(
        new CustomEvent("lahza:heartbeat")
      );
    } catch (error) {
      console.warn(
        "LAHZA analytics heartbeat:",
        error
      );
    }
  }

  // يجيب إجمالي الزوار + الموجودين الآن
  async function getStats() {
    try {
      const data = await rpc(
        "get_site_stats",
        {}
      );

      const row =
        Array.isArray(data)
          ? data[0]
          : data;

      return (
        row || {
          total_visitors: 0,
          online_now: 0
        }
      );
    } catch (error) {
      console.warn(
        "LAHZA analytics stats:",
        error
      );

      return {
        total_visitors: 0,
        online_now: 0
      };
    }
  }

  window.LahzaAnalytics = {
    getStats,
    heartbeat,
    visitorId
  };

  // أول دخول
  heartbeat();

  // تحديث الأون لاين كل 25 ثانية
  setInterval(
    heartbeat,
    25000
  );

  // إذا رجع الشخص للتبويب
  document.addEventListener(
    "visibilitychange",
    () => {
      if (
        document.visibilityState ===
        "visible"
      ) {
        heartbeat();
      }
    }
  );
})();
