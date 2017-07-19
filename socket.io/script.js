(function() {   
    var elements = {
        registration: document.querySelector('#registration'),
        chat: document.querySelector('#chat'),
        userHeader: document.querySelector('#userHeader'),
        userName: document.querySelector('#userName'),
        userNickname: document.querySelector('#userNickname'),
        addButton: document.querySelector('#addButton'),
        text: document.querySelector('#text'),
        textSubmit: document.querySelector('#textSubmit'),
        messages: document.querySelector('#messages'),
        participants: document.querySelector('#participants'),
        typing: document.querySelector('#typing'),

};
    var isName = 0;
    var header = 'Add New User to the Chat';
    userHeader.innerText = header;

    var socket = io.connect();

//typing
    text.onkeyup = function() {
        var type = '@' + userName.value + ' is typing...';

        socket.emit('typing', type);
    }
    socket.on('typing', function (type) {
        typing.innerText = type;
    });

//add new user
    var userStatus = ["online", "offline", "justEnter"];

    addButton.onclick = function() {
        if (userName.value == '' || userNickname.value == '') {
            alert('Please write you name and nickname');
        } else {
            var guy = {
                name: userName.value,
                nickName: userNickname.value,
                status: status
            };
            // console.log(guy);
                
            socket.emit('user added', guy);
            isName = 1;
            registration.style.display = 'none';
            chat.style.display = 'block';
        }
    };

    textSubmit.onclick = function(users) {
        if (text.value == '' ) {
            alert('Please write you messages');
        } else {
            let time = new Date();
            let messTime = time.getHours() + ":" + time.getMinutes();
            let id = 0;
            var data = {
                name: userName.value,
                nickName: userNickname.value,
                text: text.value,
                time: messTime,
                //hightlited: false
            }
            text.value = '';
            typing.innerText = '';
            socket.emit('chat message', data, users);
        }
    };

    socket.on('chat history', function(msg, users) {
        //debugger;
        messages.innerHTML = '';
        var drop = messages.length - 100; 
        if (messages.length > 100) {
            messages.splice(0, drop);
        }
        for ( let i in msg  ) {
                if (msg.hasOwnProperty(i)) {
                    var div = document.createElement('div');
                    var divInner = document.createElement('div');
                    var bodyDiv = document.createElement('div');
                    var time = document.createElement('div');
                    var curTime = new Date();
                    div.setAttribute('class', 'newMessage');
                    divInner.setAttribute('class', 'innerMessage');
                    bodyDiv.setAttribute('class', 'bodyDiv');
                    time.setAttribute('class', 'time');
                    divInner.innerText = msg[i].name + ' @(' + msg[i].nickName + ')';
                    bodyDiv.innerText =  msg[i].text;
                    time.innerText = curTime.getHours() + ":" + curTime.getMinutes();

                    messages.appendChild(div);
                    div.appendChild(divInner);
                    divInner.appendChild(time);
                    divInner.appendChild(bodyDiv);
            }
        }
    });

    socket.on('chat message', function(msg, users) {
        renderMessages(msg, users); 
    });


    socket.on('user added', function(user) {

        console.log(user.id);
        renderUser(user);  

    });  
    socket.on('change status', function(user) {
       setTimeout( function (){
        let userLi = document.getElementById(user.id);
        if ( userLi != null ) {    
            let spanLi = userLi.querySelector('span');
            spanLi.setAttribute('class', user.status);
            }
        }, 500);  
    });

    socket.on('all users', function(user) {
        console.log(user);
        participants.innerHTML = '';
        for( let i in user ) {
                if( user.hasOwnProperty(i) ) {
                     renderUser(user[i]);
                }                    
        }
    });
    
    function renderUser(user) {
        var li = document.createElement('li');
        var span = document.createElement('span');                    
        span.setAttribute('class', user.status);
        li.setAttribute('class', 'chat-user');
        li.setAttribute('id', user.id);

        li.innerText = user.name + ' @(' + user.nickName + ')';
        li.appendChild(span); 
        participants.appendChild(li);
    } 

    function renderMessages(msg, users) {
        var div = document.createElement('div');
        var divInner = document.createElement('div');
        var bodyDiv = document.createElement('div');
        var time = document.createElement('div');
        var curTime = new Date();

        console.log(users);
        div.setAttribute('class', 'newMessage');
        divInner.setAttribute('class', 'innerMessage');
        bodyDiv.setAttribute('class', 'bodyDiv');
        time.setAttribute('class', 'time');
        var patt = new RegExp('@' + users[socket.id].nickName, 'i');
        if (patt.test(msg.text) && users[socket.id] ) {
            div.setAttribute('id', 'highlighted');
        };

        divInner.innerText = msg.name + ' @(' + msg.nickName + ')';
        bodyDiv.innerText =  msg.text;
        time.innerText = curTime.getHours() + ":" + curTime.getMinutes();

        messages.appendChild(div);
        div.appendChild(divInner);
        divInner.appendChild(time);
        divInner.appendChild(bodyDiv);

    }
})();

