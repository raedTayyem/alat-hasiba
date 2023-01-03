import React from "react";
import { Helmet } from "react-helmet-async";
import "./NetSpeed.scss";

class NetSpeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      speed: "",
    };
    this.check = this.check.bind(this);
  }

  check() {
    const imageAddr = "https://cdn.wallpapersafari.com/42/1/Scu4IV.jpg";
    const downloadSize = 18300000;

    const NewlineText = (text) => {
      return text.split("\n").map((str) => <p>{str}</p>);
    };

    const ShowProgressMessage = (msg) => {
      if (console) {
        if (typeof msg == "string") {
          console.log(msg);
        } else {
          var text = "";
          for (var i = 0; i < msg.length; i++) {
            console.log(msg[i]);
            text += msg[i] + "\n";
          }
          var newText = NewlineText(text);
          console.log(newText);
          this.setState({ speed: newText });
        }
      }

      var oProgress = document.getElementById("progress");
      if (oProgress) {
        var actualHTML = typeof msg == "string" ? msg : msg.join("<br />");
        oProgress.innerHTML = actualHTML;
      }
    };

    const InitiateSpeedDetection = () => {
      const button = document.getElementById('check');
      button.classList.add('loading');
      button.classList.remove('checkBtn')
      window.setTimeout(MeasureConnectionSpeed, 1);
    };

    InitiateSpeedDetection()

    if (window.addEventListener) {
      window.addEventListener("load", InitiateSpeedDetection, false);
    } else if (window.attachEvent) {
      window.attachEvent("onload", InitiateSpeedDetection);
    }

    function MeasureConnectionSpeed() {
      var startTime, endTime;
      var download = new Image();
      download.onload = function () {
        endTime = new Date().getTime();
        showResults();
      };

      download.onerror = () => {
        ShowProgressMessage("Invalid image, or error downloading");
      };

      startTime = new Date().getTime();
      var cacheBuster = "?nnn=" + startTime;
      download.src = imageAddr + cacheBuster;

      function showResults() {
        const button = document.getElementById('check');
        var duration = (endTime - startTime) / 1000;
        var bitsLoaded = downloadSize * 8;
        var speedBps = (bitsLoaded / duration).toFixed(2);
        var speedKbps = (speedBps / 1024).toFixed(2);
        var speedMbps = (speedKbps / 1024).toFixed(2);
        button.classList.remove('loading');
        ShowProgressMessage([
          "سرعة اتصالك هي:",
          speedBps + " bps",
          speedKbps + " kbps",
          speedMbps + " Mbps",
        ]);
        button.classList.add('checkBtn')
      }
    };
  }

  render() {
    
    return (
      <>
        <Helmet>
          <title>سرعة الإنترنت</title>
          <meta name="description" content=" قياس سرعة الإنترنت" />
          <link rel="canonical" href="/NetSpeed" />
        </Helmet>
        <div className="main-app">
          <div className="netSpeed">
            <button onClick={this.check} className="checkBtn" id="check">فحص</button>
            {this.state.speed}
          </div>
          <h3>
            ليس هناك من ينكر أن ظهور الإنترنت أحدث ثورة في طريقة حياتنا وتعلمنا.
            اليوم ، يعد الإنترنت مصدرًا للمعلومات والترفيه والتجارة لمليارات
            الأشخاص حول العالم. ومع ذلك ، يواجه العديد من المستخدمين مشكلة في
            الوصول إلى الإنترنت أو لديهم سرعات وصول بطيئة. هذا يرجع إلى حقيقة أن
            معظم نقاط الوصول إلى الإنترنت تقع في الشركات والمدارس والمكاتب ،
            والتي غالبًا ما تكون بعيدة عن المكان الذي يعيش فيه الناس. للمساعدة
            في توسيع نطاق الوصول إلى الويب وإتاحة الوصول إلى خدمات عالية الجودة
            لجميع الأشخاص ، من المهم التفكير في كيفية جعل الوصول إلى الإنترنت
            أسرع.
            <br />
            <br />
            بشكل أساسي ، تعد تقنيات الوصول إلى الإنترنت السلكي الحالية متأخرة
            جدًا عن التكنولوجيا اللاسلكية من حيث السرعة والمدى. في غضون سنوات
            قليلة فقط ، تحولت التكنولوجيا اللاسلكية من كونها حداثة إلى استخدامها
            في إعدادات المنزل العادية. هذا يرجع إلى حقيقة أن الشبكات اللاسلكية
            يمكن أن تصل إلى أبعد من الشبكات السلكية. علاوة على ذلك ، لا تتطلب
            نقاط الوصول إلى الإنترنت اللاسلكية اتصالاً ماديًا بجهاز كمبيوتر أو
            جهاز مثل النقط السلكية. هذا يجعلها أسهل في التثبيت والاستخدام ؛ ليست
            هناك حاجة لإعدادات معقدة أو معدات باهظة الثمن. على هذا النحو ، من
            المهم الاستثمار في التقنيات الجديدة عند إجراء تحسينات على كيفية عمل
            الوصول إلى الإنترنت. - - Speedtest هو أحد هذه الأدوات التي تم
            إنشاؤها مع وضع هذا الهدف في الاعتبار. يتيح لك قياس سرعة الاتصال
            مباشرة من هاتفك أو جهاز الكمبيوتر دون أي تدخل أو إعداد مطلوب. أصبح
            هذا التطبيق وسيلة شائعة للأشخاص لقياس أداء اتصالهم بالإنترنت دون
            التدخل فيه بأنفسهم. كما يسمح للمستخدمين بمقارنة سرعات اتصالهم مع
            سرعات المستخدمين الآخرين حول العالم لتحديد مشاكل النقاط الساخنة قبل
            الذهاب إلى هناك شخصيًا. - - يمكن لأي شخص استخدام هذا التطبيق كطريقة
            سهلة لاختبار سرعة اتصالهم بالإنترنت. ومع ذلك ، فمن الأفضل استخدامه
            عند قياس سرعة الإنترنت من خلال تطبيق أو نظام يقيس الاتصال عبر معيار
            أو قياسي بدلاً من السرعة الفعلية. للقيام بذلك ، ستحتاج إلى شيء مثل
            خدمة Ookla's Speedtest المميزة. يتطلب هذا التطبيق رسم اشتراك سنوي
            ولكنه يتضمن ميزات أكثر من Speedtest العادي مثل المراقبة عن بُعد
            والمساعدة في نقل الملفات. بينما يعد قياس سرعة الاتصال باستخدام
            Speedtest مفيدًا ، فإن قياسه باستخدام خدمة Ooklan يتيح لك تتبع
            استخدامك للإنترنت وتحسين اتصالك عن طريق تقييد الاستخدام خلال ساعات
            الذروة أو أثناء تنزيل ملفات كبيرة. تم تجهيز نقاط الوصول بقدرات
            لاسلكية ، ويمكن لكوكبنا تسخير هذه الأدوات الثورية بشكل فعال. يسمح
            هذا للأشخاص الذين يعيشون في المناطق الريفية حيث لا يوجد عمل أو مدرسة
            قريبة بالمشاركة في هذا العصر الجديد من الاتصالات والترفيه. تمكّن مثل
            هذه المقاييس أيضًا الشركات من فهم كيفية استخدام خدماتها وأين يمكن
            للناس الاستفادة من السرعة المتزايدة. في النهاية ، سيساعد هذا الجميع
            على استخدام الإنترنت بشكل أكثر كفاءة وفعالية!
          </h3>
        </div>
      </>
    );
  }
}

export default NetSpeed;
