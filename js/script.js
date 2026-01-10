/**
    كلاس الآلة الحاسبة: يجمع بين البيانات والمنطق البرمجي 
    هذا الأسلوب  يسهل قراءة الكود وصيانته
 */
class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear(); // تصفير الآلة عند التشغيل
    }

    /** تصفير القيم */
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    /** حذف آخر حرف: لاقتطاع النص من البداية حتى قبل النهاية بحرف */
    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    /** إضافة رقم: المنطق هنا هو "دمج نصوص" وليس جمع حسابي */
    appendNumber(number) {
        // منع إضافة أكثر من نقطة عشرية واحدة
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        // إذا كانت الشاشة بها 0، استبدله بالرقم الجديد بدلاً من الإضافة بجانبه )
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    /** اختيار العملية: نجهز الحاسبة لاستقبال الرقم الثاني */
    chooseOperation(operation) {
        // معالجة النسبة المئوية فوراً دون انتظار رقم ثانٍ
        if (operation === '%') {
            this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
            return;
        }
        
        if (this.currentOperand === '') return;
        
        // إذا كان هناك رقم سابق فعلاً، قم بحسابه أولاً قبل البدء بعملية جديدة
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand; // نقل الرقم الحالي للأعلى
        this.currentOperand = '0'; // تصفير الشاشة السفلية للرقم التالي
    }

    /** الحساب الفعلي: تحويل النصوص إلى أرقام وإجراء الرياضيات */
    compute() {
        let result;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+': result = prev + current; break;
            case '-': result = prev - current; break;
            case '×': result = prev * current; break;
            case '÷': 
                if (current === 0) { 
                    alert("Math Error: Cannot divide by zero"); 
                    this.clear(); 
                    return; 
                }
                result = prev / current; 
                break;
            default: return;
        }
        this.currentOperand = result;
        this.operation = undefined;
        this.previousOperand = '';
    }

    /** التحديث البصري: الوظيفة الوحيدة المسؤولة عن تعديل ما يراه المستخدم في HTML */
    updateDisplay() {
        this.currentOperandElement.innerText = this.currentOperand;
        if (this.operation != null) {
            // عرض الرقم السابق مع علامة العملية في الأعلى
            this.previousOperandElement.innerText = `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

// --- مرحلة ربط الكود بالواجهة ---

const calculator = new Calculator(
    document.getElementById('previous-operand'),
    document.getElementById('current-operand')
);

// استماع لضغطات الأرقام (0-9 والـ .)
document.querySelectorAll('[data-number]').forEach(btn => {
    btn.addEventListener('click', () => {
        calculator.appendNumber(btn.innerText);
        calculator.updateDisplay();
    });
});

// استماع لضغطات العمليات (+, -, ×, ÷, %)
document.querySelectorAll('[data-operation]').forEach(btn => {
    btn.addEventListener('click', () => {
        calculator.chooseOperation(btn.innerText);
        calculator.updateDisplay();
    });
});

// الأزرار المنفردة
document.querySelector('[data-equals]').addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

document.querySelector('[data-all-clear]').addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

document.querySelector('[data-delete]').addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});