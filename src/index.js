'use strict';

var app = new Vue({
    el: '#app',
    data: {
        mode: 'octal',
        perms: {
            user: 6,
            group: 6,
            other: 4,
            text: 'rw-rw-r--'
        }
    },
    computed: {
        permissionAsOct: function () {
            let perms = unix_perm_to_int(this.perms.text);
            this.perms.user = perms[0];
            this.perms.group = perms[1];
            this.perms.other = perms[2];
        },
        permissionText: function () {
            return `${int_to_unix_perm(this.perms.user)}${int_to_unix_perm(this.perms.group)}${int_to_unix_perm(this.perms.other)}`
        },
        permalink: function () {
            return `?u=${this.perms.user}&g=${this.perms.group}&o=${this.perms.other}`;
        }
    },
    methods: {
        update_from_text: function (event) {
            if (['r', 'w', 'x', '-'].indexOf(event.key) > -1) {
                if (event.target.value.length >= 9) {
                    let perms = unix_perm_to_int(event.target.value);
                    this.perms.user = perms[0];
                    this.perms.group = perms[1];
                    this.perms.other = perms[2];
                }
            }
            return this;
        }
    },
    created: function () {
        console.log("CREATED!");
        if (window.location.search != "") {
            let parts = window.location.search.replace("?", "").split("&");
            for (let p in parts) {
                console.log(parts[p]);
                let current = parts[p];
                let type = current.split("=")[0];
                let value = current.split("=")[1];
                switch (type) {
                    case "u":
                        this.perms.user = value;
                        break;
                    case "g":
                        this.perms.group = value;
                        break;
                    case "o":
                        this.perms.other = value;
                        break;
                    default:
                        console.log("Unsupported type: ", type);
                }
            }
        }
    }
})

function int_to_unix_perm(int) {
    int = parseInt(int)
    let perms = "-";
    switch (int) {
        case 7:
            perms = "rwx"
            break;
        case 6:
            perms = "rw-"
            break;
        case 5:
            perms = "r-x"
            break;
        case 4:
            perms = "r--"
            break;
        case 3:
            perms = "-wx"
            break;
        case 2:
            perms = "-w-"
            break;
        case 1:
            perms = "--x"
            break;
        case 0:
            perms = "---"
            break;
    }

    return perms;
}

function unix_perm_to_int(perms) {
    let user = perm_string_to_int(perms.substr(0, 3));
    let group = perm_string_to_int(perms.substr(3, 3));
    let other = perm_string_to_int(perms.substr(6, 3));

    return [user, group, other];
}

function perm_string_to_int(perm_str) {
    let perms = 0;
    switch (perm_str) {
        case "rwx":
            perms = 7
            break;
        case "rw-":
            perms = 6
            break;
        case "r-x":
            perms = 5
            break;
        case "r--":
            perms = 4
            break;
        case "-wx":
            perms = 3
            break;
        case "-w-":
            perms = 2
            break;
        case "--x":
            perms = 1
            break;
        case "---":
            perms = 0
            break;
    }

    return perms;
}
