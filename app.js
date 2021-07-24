$("#num-holder p").text("");
var map = {'(':0,'+':1,'-':1,'*':2,'/':2};
var exp="";
var max_size=11;
$(".cmd").click(function(){
    var cmd=$(this).text();
    if(cmd=="AC" || cmd=="<=" || exp.length<max_size)
    {
        $('#info').removeClass('msg');
        $("#info").text("");
    }
    if(cmd=="( )"||cmd=="=")
    {
        if(cmd=="=")
        {
           evaluate();
           $("#num-holder p").text(exp);
        }
        else
        {
           let B = putBracket();
           if(exp.length<max_size)
           {
               exp += B;
           }
        }
    }
    else if(cmd=="AC")
    {   
        exp=""; 
    }
    else if(cmd=="<=")
    {
        exp = exp.slice(0,exp.length-1);
    }
    else if(exp.length<max_size)
    {
            exp += cmd;  
    }
    
    if(exp.length == max_size)
    {
        $('#info').addClass('msg');
        $("#info").text("Limit Reached!");
    }
    if(cmd=="AC" || cmd=="<=" || exp.length<=max_size)
    {
        $("#num-holder p").text(exp); 
    }
});
function calc(op2,op1,opr)
{
    switch(opr)
    {
        case '+' : return op2 + op1;
        case '-' : return op2 - op1;
        case '/' : return op2 / op1;
        case '*' : return op2 * op1;
    }
}
function putBracket()
{
    let op=0,cl=0;
    for(let i=0;i<exp.length;i++)
    {
        if(exp[i]=='(') op++;
        if(exp[i]==')') cl++;
    }
    if(op==cl) return '(';
    else return ')';
}
function evaluate()
{
    var exp_obj= [];
    for(let i=0;i<exp.length;i++)
    {
        if(exp[i]=='+'||exp[i]=='-'||exp[i]=='*'||exp[i]=='%'||exp[i]=='/'||exp[i]=='('||exp[i]==')')
        {
            exp_obj.push(exp[i]);
        }
        else
        {
           let string_num=exp[i];
           let j = i+1;
           while(j<exp.length&&(exp[j]=='.'||(exp[j]>='0'&&exp[j]<='9')))
           {
                string_num+=exp[j];
                j++;
           }
           exp_obj.push(Number(string_num));
           i=j-1;
        }
    }
    if(exp_obj[0]=='-' || exp_obj[0]=='+')
    {
        if(exp_obj[0]=='-') exp_obj[1] *= -1;
        exp_obj.splice(0,1);
    }
    for(let i=1;i<exp_obj.length-1;i++)
    {
        if(typeof(exp_obj[i-1])!="number" && exp_obj[i]=='-' && typeof(exp_obj[i+1])=="number")
        {
            exp_obj.splice(i,1);
            exp_obj[i] *= -1;
        }
    }
    var operator_stack=[];
    var operand_stack=[];
    for(let i=0;i<exp_obj.length;i++)
    {
        if(exp_obj[i]=='+'||exp_obj[i]=='-'||exp_obj[i]=='*'||exp_obj[i]=='%'||exp_obj[i]=='/'||exp_obj[i]=='('||exp_obj[i]==')')
        {   
            if(exp_obj[i]=='%')
            {
                let operand = operand_stack.pop();
                operand_stack.push(operand/100);
            }
            else if(operator_stack.length==0 || exp_obj[i]=='(')
            {
                operator_stack.push(exp_obj[i]);
            }
            else
            {
                
                if(exp_obj[i]==')')
                {
                    while(operator_stack[operator_stack.length-1]!='(')
                    {
                        let operator = operator_stack.pop();
                        let operand1 = operand_stack.pop();
                        let operand2 = operand_stack.pop();
                        operand_stack.push(calc(operand2,operand1,operator));
                    }
                    operator_stack.pop();
                }
                else
                {
                    while(operator_stack.length>0 && map[exp_obj[i]]<=map[operator_stack[operator_stack.length-1]])
                    {
                        let operator = operator_stack.pop();
                        let operand1 = operand_stack.pop();
                        let operand2 = operand_stack.pop();
                        operand_stack.push(calc(operand2,operand1,operator));
                    }
                    operator_stack.push(exp_obj[i]);  
                }
            }
        }
        else
        {
            operand_stack.push(exp_obj[i]);
        }   
    }

    while(operator_stack.length>0)
    {
        let operator = operator_stack.pop();
        let operand1 = operand_stack.pop();
        let operand2 = operand_stack.pop();
        operand_stack.push(calc(operand2,operand1,operator));
    }
    var ans = Math.round(operand_stack[0] *100)/100;
    exp = ans.toString();
}