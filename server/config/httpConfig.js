module.exports = {
  HTTP_API: "https://b125-103-76-10-74.in.ngrok.io",
  ExtractId: function (str) {
   try{ 
var matches = str.match(/(\d+)/);
    if (matches) return matches[0];
} catch(e) {return '';}
  },
  CombineThemeID: function (str) {
    var str1 = "gid://shopify/Theme/";
    str = str1.concat(str);
    return str;
  },
  InstallBaseCode: function (code, id) {
    const exist = code.indexOf("<!-- Pinterest Pixel Base Code -->");
    if (exist > 0) {
      //its exist
      const str =
        '<script type="text/javascript">!function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var n=window.pintrk;n.queue=[],n.version="3.0";var t=document.createElement("script");t.async=!0,t.src=e;var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");pintrk("load", "' +
        id +
        '");pintrk("page");</script>';
      const result = code.replace(
        code.split("<!-- Pinterest Pixel Base Code -->")[1],
        str
      );
      return result;
    } else {
      const index = code.indexOf("</head>");
      const str =
        '<!-- Pinterest Pixel Base Code --><script type="text/javascript">!function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var n=window.pintrk;n.queue=[],n.version="3.0";var t=document.createElement("script");t.async=!0,t.src=e;var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");pintrk("load", "' +
        id +
        '");pintrk("page");</script><!-- Pinterest Pixel Base Code --><!-- magicpin -->';
      const str1 = code.substring(0, index);
      const str2 = code.substring(index - 1, code.length);
      const result = str1.concat(str).concat(str2);
      return result;
    }
  },
  InstallCartCode: function (code) {
    const exist = code.indexOf(
      "onclick=" +
        '"pintrk' +
        "('track', 'addtocart',{value:{{product.price | money_without_currency | remove: ',' }},currency:'{{ shop.currency }}',order_quantity: 1,order_id:'{{product.title}}'});" +
        '"'
    );
    if (exist <= 0) {
      //its NOT exist
      const addtocartIndex = code.indexOf('type="submit"');
      const addtocartStr =
        "onclick=" +
        '"pintrk' +
        "('track', 'addtocart',{value:{{product.price | money_without_currency | remove: ',' }},currency:'{{ shop.currency }}',order_quantity: 1,order_id:'{{product.title}}'});" +
        '"';
      const result = code
        .substring(0, addtocartIndex)
        .concat(addtocartStr)
        .concat(code.substring(addtocartIndex - 1, code.length));
      return result;
    } else {
      return code;
    }
  },
  DeleteCartCode: function (code) {
    const exist = code.indexOf(
      "onclick=" +
        '"pintrk' +
        "('track', 'addtocart',{value:{{product.price | money_without_currency | remove: ',' }},currency:'{{ shop.currency }}',order_quantity: 1,order_id:'{{product.title}}'});" +
        '"'
    );
    if (exist > 0) {
      //its exist
      code = code
        .split(
          "onclick=" +
            '"pintrk' +
            "('track', 'addtocart',{value:{{product.price | money_without_currency | remove: ',' }},currency:'{{ shop.currency }}',order_quantity: 1,order_id:'{{product.title}}'});" +
            '"'
        )[0]
        .concat(
          code.split(
            "onclick=" +
              '"pintrk' +
              "('track', 'addtocart',{value:{{product.price | money_without_currency | remove: ',' }},currency:'{{ shop.currency }}',order_quantity: 1,order_id:'{{product.title}}'});" +
              '"'
          )[1]
        );
      return code;
    } else {
      return code;
    }
  },
  InstallVisitCode: function (code, id) {
    const exist = code.indexOf("<!--magicpin visit-->");
    if (exist <= 0) {
      //its NOT exist
      const visitStr =
        "<!--magicpin visit--><script>pintrk('track', 'pagevisit');</script><!--magicpin visit-->";
      const index = code.indexOf("</head>");
      const result = code
        .substring(0, index)
        .concat(visitStr)
        .concat(code.substring(index - 1, code.length));
      return result;
    } else {
      //its exist
      const visitStr = "<script>pintrk('track', 'pagevisit');</script>";
      const result = code.replace(
        code.split("<!--magicpin visit-->")[1],
        visitStr
      );
      return result;
    }
  },
  DeleteVisitCode: function (code) {
    const exist = code.indexOf("<!--magicpin visit-->");
    if (exist > 0) {
      //its exist
      const result = code
        .split("<!--magicpin visit-->")[0]
        .concat(code.split("<!--magicpin visit-->")[2]);
      return result;
    } else {
      return code;
    }
  },
  InstallSearchCode: function (code) {
    const exist = code.indexOf(
      "onclick=" +
        '"pintrk' +
        "('track', 'search',{search_query:'{{ search.terms | escape }}'});" +
        '"'
    );
    if (exist <= 0) {
      //its NOT exist
      const addtocartIndex = code.indexOf('type="submit"');
      const addtocartStr =
        "onclick=" +
        '"pintrk' +
        "('track', 'search',{search_query:'{{ search.terms | escape }}'});" +
        '"';
      const result = code
        .substring(0, addtocartIndex)
        .concat(addtocartStr)
        .concat(code.substring(addtocartIndex - 1, code.length));
      return result;
    } else {
      return code;
    }
  },
  DeleteSearchCode: function (code) {
    const exist = code.indexOf(
      "onclick=" +
        '"pintrk' +
        "('track', 'search',{search_query:'{{ search.terms | escape }}'});" +
        '"'
    );
    if (exist > 0) {
      //its exist
      code = code
        .split(
          "onclick=" +
            '"pintrk' +
            "('track', 'search',{search_query:'{{ search.terms | escape }}'});" +
            '"'
        )[0]
        .concat(
          code.split(
            "onclick=" +
              '"pintrk' +
              "('track', 'search',{search_query:'{{ search.terms | escape }}'});" +
              '"'
          )[1]
        );
      return code;
    } else {
      return code;
    }
  },
};
