(function () {
    function isIDCardNumberValid(code) {
        var city={11:"����",12:"���",13:"�ӱ�",14:"ɽ��",15:"���ɹ�",21:"����",22:"����",23:"������ ",31:"�Ϻ�",32:"����",33:"�㽭",34:"����",35:"����",36:"����",37:"ɽ��",41:"����",42:"���� ",43:"����",44:"�㶫",45:"����",46:"����",50:"����",51:"�Ĵ�",52:"����",53:"����",54:"���� ",61:"����",62:"����",63:"�ຣ",64:"����",65:"�½�",71:"̨��",81:"���",82:"����",91:"���� "};
        if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
            //console.log("idcard reg error");
            return false;
        }
        else if(!city[code.substr(0,2)]){
            //console.log("idcard area error");
            return false;
        }
        else{
            //18λ���֤��Ҫ��֤���һλУ��λ
            if(code.length == 18){
                code = code.split('');
                //��(ai��Wi)(mod 11)
                //��Ȩ����
                var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
                //У��λ
                var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
                var sum = 0;
                var ai = 0;
                var wi = 0;
                for (var i = 0; i < 17; i++)
                {
                    ai = code[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                if(parity[sum % 11] != code[17]){
                    //console.log("idcard check code error");
                    return false;
                }
            }
        }
        return true;
    }
    //var code = "42900519871015005X";
    //console.log(isIDCardNumberValid(code));



    var a = function(){
        console.log("aaaaa");
    };
    console.log(typeof a);
    console.log(typeof a === 'function');
    console.log(typeof a == 'function');
})();