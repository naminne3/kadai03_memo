const inputForm = document.querySelector('.task-input');
const inputDate = document.querySelector('.date');
const addBtn = document.querySelector('.btn-add-btn');
const taskList = document.querySelector('.task-list');

// ページがロードされたらタスクを表示し、ボタンのイベントを設定する
window.addEventListener('load', () => {
    displayTasks();
    initializeTaskListEvents();
});

// 追加ボタンが押されたときにタスクを追加する
addBtn.addEventListener('click', () => {
    if (!inputForm.value) {
        // タスクの入力フォームが空の場合、エラーメッセージを表示
        const errorMsg = document.querySelector('.error-msg');
        errorMsg.classList.add('show');
        return;
    }

    const taskId = generateTaskId();
    const task = {
        id: taskId,
        content: inputForm.value,
        date: inputDate.value ? formatTaskDate(inputDate.value) : null,
    };

    // タスクリストにタスクを追加し、ローカルストレージに保存
    taskList.innerHTML += createTaskElement(task);
    initializeTaskListEvents();
    saveTaskToLocalStorage(task);

    // 入力フォームをリセット
    inputForm.value = '';
    inputDate.value = '';
});

// タスクの入力フォームでキーが離されたときにエラーメッセージを消す
inputForm.addEventListener('keyup', () => {
    const errorMsg = document.querySelector('.error-msg');
    if (errorMsg.classList.contains('show') && inputForm.value !== '') {
        errorMsg.classList.remove('show');
    }
});

// タスクのHTML要素を作成
const createTaskElement = (task) => {
    return `
        <li class="task-item" data-task-id="${task.id}">
            ${task.content}
            <div class="item-wrapper">
                ${task.date ? `<div class="item-date">${task.date}</div>` : ''}
                <div class="item-btn">
                    <button class="btn complete-btn">完了</button>
                    <button class="btn delete-btn" data-task-id="${task.id}">削除</button>
                </div>
            </div>
        </li>`;
};

// ローカルストレージにタスクを保存
const saveTaskToLocalStorage = (task) => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// ローカルストレージからタスクを表示
const displayTasks = () => {
    taskList.innerHTML = '';
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        taskList.innerHTML += createTaskElement(task);
    });
};

// 新しいタスクIDを生成
const generateTaskId = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    return tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
};

// 期日のフォーマットを変更
const formatTaskDate = (dateString) => {
    const selectedDate = new Date(dateString);
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][selectedDate.getDay()];
    return `期日: ${year}年${month}月${day}日 (${dayOfWeek})`;
};

// タスクリスト内のボタンイベントを設定
const initializeTaskListEvents = () => {
    const deleteBtns = document.querySelectorAll('.delete-btn');
    const completeBtns = document.querySelectorAll('.complete-btn');

    // 削除ボタンのイベント設定
    deleteBtns.forEach(deleteBtn => {
        deleteBtn.addEventListener('click', (e) => {
            const deleteTarget = e.target.closest('.task-item');
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const targetId = deleteTarget.dataset.taskId;
            const updatedTasks = tasks.filter(task => task.id !== parseInt(targetId));

            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
            taskList.removeChild(deleteTarget);
        });
    });

    // 完了ボタンのイベント設定
    completeBtns.forEach(completeBtn => {
        completeBtn.addEventListener('click', (e) => {
            const compTarget = e.target.closest('.task-item');
            compTarget.classList.toggle('complete');
        });
    });
};
