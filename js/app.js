let questions = [];


const setQuestions = (res) =>{
    let rows = res.split('\n');
    rows = rows.map(row  => row.split(','));
    questions = rows.map((row,key)=>{
        return {
            question: row[0],
            answer: row[1],
            options: row.slice(1),
            selected: key === 0 ? true : false,
            user_answer: null,
        }
    });
}


const displayQuestion = () =>{
    MAIN_AREA.empty();
    let question = questions.filter((question)=>{
        return question.selected;
    })[0];
    let question_area = $('<div>').html(question.question).addClass('question_area');
    MAIN_AREA.append(question_area);

    let option_area = $('<div>').addClass('option_area');
    let options = question.options.map((option)=>{
        return $('<button>').html(option).addClass('option_button');
    });
    options.forEach((option)=>{
        option_area.append(option);
    });
    MAIN_AREA.append(option_area);
    
    let result_area = $('<div>').addClass('result_area');
    let question_all = questions.length;
    //正解数をカウント
    let correct_count = questions.filter((question)=>{
        return question.answer === question.user_answer;
    }).length;
    result_area.html(correct_count + '/' + question_all).addClass('result');
    MAIN_AREA.append(result_area);
}


const createQuestions = () =>{
    //subject_listでselectedがtrueのものがなければreturn
    let selected_subject = subject_list.filter((subject)=>{
        return subject.selected;
    });
    if(selected_subject.length === 0){
        questions = [];
        displayQuestion();
        return;
    }
    //２つ以上あった場合はエラーを表示してreturn
    if(selected_subject.length > 1){
        questions = [];
        alert('問題が発生しました');
        return;
    }
    //一つだけの場合はajaxでcsvを取得
    $.ajax({
        url: BASE_URL + 'csv/' + selected_subject[0].id + '.csv',
        type: 'GET',
        dataType: 'text',
    }).done((res)=>{
        setQuestions(res);
        displayQuestion();
    }).fail((err)=>{
        console.log(err);
    });
}

const nextQuestion = () =>{
    let current_question = questions.filter((question)=>{
        return question.selected;
    })[0];
    current_question.selected = false;
    let next_question = questions[questions.indexOf(current_question) + 1];
    if(next_question){
        next_question.selected = true;
    }else{
        questions[0].selected = true;
        alert('終了');
    }

}


$(document).on('click','.option_button', (e)=>{
    let selected_option = $(e.target).html();
    let question = questions.filter((question)=>{
        return question.selected;
    })[0];
    question.user_answer = selected_option;
    nextQuestion();
    displayQuestion();
});

$(document).on('click','.subject_button', (e)=>{
    createQuestions();
});