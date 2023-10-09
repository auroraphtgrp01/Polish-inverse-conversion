new Vue({
    el: '#app',
    data: {
        stack: [],
        output: [],
        steps: [],
        finalResult: '', // Thêm biến để lưu kết quả cuối cùng
        finalResult1: ''
    },
    methods: {
        displaySteps() {
            const infixExpression = document.getElementById("textInput").value;
            const {
                postfixExpression,
                steps
            } = this.infixToPostfixWithSteps(infixExpression);

            const outputTable = document.getElementById("outputTable");

            // Xóa nội dung cũ của bảng
            outputTable.innerHTML = "";

            // Tạo bảng
            const table = document.createElement("table");
            table.classList.add("table");
            table.classList.add("table-bordered");
            table.classList.add("conversion-table");
            // Tiêu đề
            const headerRow = document.createElement("tr");
            const objectHeader = document.createElement("th");
            objectHeader.classList.add("text-danger");
            objectHeader.textContent = "Object";
            const stackHeader = document.createElement("th");
            stackHeader.classList.add("text-danger");
            stackHeader.textContent = "Stack";
            const outputHeader = document.createElement("th");
            outputHeader.classList.add("text-danger");
            outputHeader.textContent = "Output";
            headerRow.appendChild(objectHeader);
            headerRow.appendChild(stackHeader);
            headerRow.appendChild(outputHeader);
            table.appendChild(headerRow);

            // Thêm từng bước vào bảng
            steps.forEach((step, index) => {
                const row = document.createElement("tr");
                const objectCell = document.createElement("td");
                objectCell.textContent = step[0];
                const stackCell = document.createElement("td");
                stackCell.textContent = step[2].join(' ');
                const outputCell = document.createElement("td");
                outputCell.textContent = step[1].join(' ');
                row.appendChild(objectCell);
                row.appendChild(stackCell);
                row.appendChild(outputCell);
                table.appendChild(row);
            });

            // Thêm bảng vào div
            outputTable.appendChild(table);

            // Lấy kết quả cuối cùng
            this.finalResult = postfixExpression;

            this.finalResult1 = this.PostfixEval(postfixExpression);
            console.log(this.finalResult1);
        },

        infixToPostfixWithSteps(infixExpression) {
            const precedence = {
                '+': 1,
                '-': 1,
                '*': 2,
                '/': 2,
                '^': 3
            };

            function isOperator(char) {
                return ['+', '-', '*', '/', '^'].includes(char);
            }

            function infixToPostfixInternal(expression) {
                const stack = [];
                const output = [];
                const steps = [];

                const tokens = expression.split(/\s+/);

                for (let token of tokens) {
                    if (!isNaN(parseFloat(token))) {
                        output.push(token);
                    } else if (token === '(') {
                        stack.push(token);
                    } else if (token === ')') {
                        while (stack.length > 0 && stack[stack.length - 1] !== '(') {
                            output.push(stack.pop());
                        }
                        stack.pop();
                    } else if (isOperator(token)) {
                        while (
                            stack.length > 0 &&
                            isOperator(stack[stack.length - 1]) &&
                            precedence[token] <= precedence[stack[stack.length - 1]]
                        ) {
                            output.push(stack.pop());
                        }
                        stack.push(token);
                    }

                    steps.push([token, [...output],
                        [...stack]
                    ]);
                }

                while (stack.length > 0) {
                    output.push(stack.pop());
                }

                return {
                    postfixExpression: output.join(' '),
                    steps
                };
            }

            return infixToPostfixInternal(infixExpression);
        },

        PostfixEval(postfixExpression) {
            const tokens = postfixExpression.split(/\s+/);
            const stack = [];

            for (let token of tokens) {
                if (!isNaN(parseFloat(token))) {
                    stack.push(parseFloat(token));
                } else {
                    const operand2 = stack.pop();
                    const operand1 = stack.pop();

                    switch (token) {
                        case '+':
                            stack.push(operand1 + operand2);
                            break;
                        case '-':
                            stack.push(operand1 - operand2);
                            break;
                        case '*':
                            stack.push(operand1 * operand2);
                            break;
                        case '/':
                            stack.push(operand1 / operand2);
                            break;
                        case '^':
                            stack.push(Math.pow(operand1, operand2));
                            break;
                        default:
                            break;
                    }
                }
            }
            return stack[0];
        }
    }
});