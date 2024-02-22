let subject_list = [];


const createSubjectList = (res) =>{
    let rows = res.split('\n');
    rows = rows.map(row  => row.split(','));
    subject_list = rows.map((row)=>{
        return {
            id: row[0],
            name: row[1],
            selected: false
        }
    });
}

const createSubjectButtons = () =>{
    buttons = [];
    subject_list.forEach((subject)=>{
        buttons.push($('<button>')
                        .html(subject.name)
                        .attr('data-id', subject.id)
                        .addClass('subject_button ' + (subject.selected ? 'selected' : 'unselected'))
                        );
    });
    return buttons;
}

const setSubjectButtons = () =>{
    SIDE_MENU.empty();
    const buttons = createSubjectButtons();
    buttons.forEach((button)=>{
        SIDE_MENU.append(button);
    });
}


$(document).on('click','.subject_button', (e)=>{
    let id = $(e.target).data('id');
    subject_list = subject_list.map((subject)=>{
        if(subject.id === id){
            subject.selected = !subject.selected;
        }else{
            subject.selected = false;
        }
        return subject;
    });
    setSubjectButtons();
});

const createSideMenu = () =>{
    $.ajax({
        url: INDEX_CSV_PATH,
        type: 'GET',
        dataType: 'text',
    }).done((res)=>{
        createSubjectList(res);
        setSubjectButtons();
    }).fail((err)=>{
        console.log(err);
    });
}

createSideMenu();
