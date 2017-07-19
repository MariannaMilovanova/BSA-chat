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
        typing: document.querySelector('#typing')
};

    var header = 'Add New User to the Chat';
    userHeader.innerText = header;

    addButton.onclick = function() {
        if (userName.value == '' || userNickname.value == '') {
            alert('Please write you name and nickname');
        } else {
            header = userName.value + ' @' + userNickname.value + ' is here!' || 'Add New User to the Chat';
            userHeader.innerText = header;

            var data = {
                name: userName.value,
                nickName: userNickname.value,
            };

            ajaxRequest({
                method: 'POST',
                url: '/users',
                data: data
            })
            registration.style.display = 'none';
            chat.style.display = 'block';
        }
    };

    textSubmit.onclick = function() {
         if (text.value == '' ) {
            alert('Please write you messages');
        } else {
            let time = new Date();
            let messTime = time.getHours() + ":" + time.getMinutes();
            var data = {
                name: userName.value,
                nickName: userNickname.value,
                text: text.value,
                time: messTime
            };
            text.value = '';

            ajaxRequest({
                method: 'POST',
                url: '/messages',
                data: data
            })
        }
    };
       
    var ajaxRequest = function(options) {
        var url = options.url || '/';
        var method = options.method || 'GET';
        var callback = options.callback || function() {};
        var data =  options.data || {};
        var xmlHttp = new XMLHttpRequest();

        xmlHttp.open(method, url, true);
        xmlHttp.setRequestHeader('Content-Type', 'application/json');
        xmlHttp.send(JSON.stringify(data));

        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.status == 200 && xmlHttp.readyState === 4 ) {
                callback(xmlHttp.responseText);
            }
        };
    }
    var getData = function() {
        ajaxRequest({
            url: '/messages',
            method: 'GET',
            callback: function(msg) {
                msg = JSON.parse(msg);
                messages.innerHTML = '';
                
                var drop = msg.length - 100; 
                if (msg.length > 100) {
                    msg.splice(0, drop);
                }
                for (var i in msg) {
                    if (msg.hasOwnProperty(i)) {
                        var div = document.createElement('div');
                        var divInner = document.createElement('div');
                        var bodyDiv = document.createElement('div');
                        var time = document.createElement('div');

                        div.setAttribute('class', 'newMessage');
                        divInner.setAttribute('class', 'innerMessage');
                        bodyDiv.setAttribute('class', 'bodyDiv');
                        time.setAttribute('class', 'time');

                        divInner.innerText = msg[i].name + ' @(' + msg[i].nickName +')';
                        bodyDiv.innerText =  msg[i].text;
                        time.innerText = msg[i].time;
                
                        messages.appendChild(div);
                        div.appendChild(divInner);
                        divInner.appendChild(time);
                        divInner.appendChild(bodyDiv);
                    }
                }
            }
        })
    };

    var getUsers = function() {
        ajaxRequest({
            url: '/users',
            method: 'GET',
            callback: function(user) {
                user = JSON.parse(user);
                participants.innerHTML = '';
                for (var i in user) {
                    if (user.hasOwnProperty(i)) {
                        var li = document.createElement('li');
                        li.setAttribute('class', 'chat-user');
                        li.innerHTML = user[i].name + ' @(' + user[i].nickName + ')';
                        participants.appendChild(li);
                    }
                }
            }
        })
    };

    getData();
    getUsers();

    setInterval(function() {
        getData();
        getUsers();
    }, 1000);

})();