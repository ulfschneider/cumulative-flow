'use babel'

const fs = require('fs');
const jsdom = require('jsdom');
const {
    JSDOM
} = jsdom;
const cfd = require('cumulative-flow');
const moment = require('moment');

const NOW = '2018-09-11';
const IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0MCw3NSkiPjxnIGNsYXNzPSJsYXllciI+PHBhdGggY2xhc3M9ImFyZWEiIHN0eWxlPSJmaWxsOiAjMjIyOyBzdHJva2U6ICNmZmY7IHN0cm9rZS13aWR0aDogLjU7IiBkPSJNMCwyOTVMNTAsMjk1TDEwMCwyOTVMMTUwLDI1Mi44NTcxNDI4NTcxNDI4NkwyMDAsMjEwLjcxNDI4NTcxNDI4NTcyTDI1MCwyMTAuNzE0Mjg1NzE0Mjg1NzJMMzAwLDg0LjI4NTcxNDI4NTcxNDI4TDM1MCw4NC4yODU3MTQyODU3MTQyOEwzNTAsMjk1TDMwMCwyOTVMMjUwLDI5NUwyMDAsMjk1TDE1MCwyOTVMMTAwLDI5NUw1MCwyOTVMMCwyOTVaIj48L3BhdGg+PHRleHQgeD0iNjAwIiB5PSI4NC4yODU3MTQyODU3MTQyOCIgZHk9Ii4zNWVtIiBmb250LXNpemU9IjEycHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBzdHlsZT0idGV4dC1hbmNob3I6IHN0YXJ0OyBmaWxsOiAjMjIyOyI+NSBkb25lPC90ZXh0PjwvZz48ZyBjbGFzcz0ibGF5ZXIiPjxwYXRoIGNsYXNzPSJhcmVhIiBzdHlsZT0iZmlsbDogIzgwODI4NTsgc3Ryb2tlOiAjZmZmOyBzdHJva2Utd2lkdGg6IC41OyIgZD0iTTAsMjk1TDUwLDI5NUwxMDAsMjk1TDE1MCwyMTAuNzE0Mjg1NzE0Mjg1NzJMMjAwLDIxMC43MTQyODU3MTQyODU3MkwyNTAsMTI2LjQyODU3MTQyODU3MTQ0TDMwMCw0Mi4xNDI4NTcxNDI4NTcxN0wzNTAsODQuMjg1NzE0Mjg1NzE0MjhMMzUwLDg0LjI4NTcxNDI4NTcxNDI4TDMwMCw4NC4yODU3MTQyODU3MTQyOEwyNTAsMjEwLjcxNDI4NTcxNDI4NTcyTDIwMCwyMTAuNzE0Mjg1NzE0Mjg1NzJMMTUwLDI1Mi44NTcxNDI4NTcxNDI4NkwxMDAsMjk1TDUwLDI5NUwwLDI5NVoiPjwvcGF0aD48L2c+PGcgY2xhc3M9ImxheWVyIj48cGF0aCBjbGFzcz0iYXJlYSIgc3R5bGU9ImZpbGw6ICM4MDgyODU7IHN0cm9rZTogI2ZmZjsgc3Ryb2tlLXdpZHRoOiAuNTsiIGQ9Ik0wLDI5NUw1MCwyOTVMMTAwLDI1Mi44NTcxNDI4NTcxNDI4NkwxNTAsMjEwLjcxNDI4NTcxNDI4NTcyTDIwMCwxNjguNTcxNDI4NTcxNDI4NThMMjUwLDg0LjI4NTcxNDI4NTcxNDI4TDMwMCw0Mi4xNDI4NTcxNDI4NTcxN0wzNTAsNDIuMTQyODU3MTQyODU3MTdMMzUwLDg0LjI4NTcxNDI4NTcxNDI4TDMwMCw0Mi4xNDI4NTcxNDI4NTcxN0wyNTAsMTI2LjQyODU3MTQyODU3MTQ0TDIwMCwyMTAuNzE0Mjg1NzE0Mjg1NzJMMTUwLDIxMC43MTQyODU3MTQyODU3MkwxMDAsMjk1TDUwLDI5NUwwLDI5NVoiPjwvcGF0aD48dGV4dCB4PSI2MDAiIHk9IjQyLjE0Mjg1NzE0Mjg1NzE3IiBkeT0iLjM1ZW0iIGZvbnQtc2l6ZT0iMTJweCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIHN0eWxlPSJ0ZXh0LWFuY2hvcjogc3RhcnQ7IGZpbGw6ICM4MDgyODU7Ij4xIGRldjwvdGV4dD48L2c+PGcgY2xhc3M9ImxheWVyIj48cGF0aCBjbGFzcz0iYXJlYSIgc3R5bGU9ImZpbGw6ICNiZWMwYzI7IHN0cm9rZTogI2ZmZjsgc3Ryb2tlLXdpZHRoOiAuNTsiIGQ9Ik0wLDI5NUw1MCwyNTIuODU3MTQyODU3MTQyODZMMTAwLDIxMC43MTQyODU3MTQyODU3MkwxNTAsMTY4LjU3MTQyODU3MTQyODU4TDIwMCw4NC4yODU3MTQyODU3MTQyOEwyNTAsNDIuMTQyODU3MTQyODU3MTdMMzAwLDQyLjE0Mjg1NzE0Mjg1NzE3TDM1MCwwTDM1MCw0Mi4xNDI4NTcxNDI4NTcxN0wzMDAsNDIuMTQyODU3MTQyODU3MTdMMjUwLDg0LjI4NTcxNDI4NTcxNDI4TDIwMCwxNjguNTcxNDI4NTcxNDI4NThMMTUwLDIxMC43MTQyODU3MTQyODU3MkwxMDAsMjUyLjg1NzE0Mjg1NzE0Mjg2TDUwLDI5NUwwLDI5NVoiPjwvcGF0aD48dGV4dCB4PSI2MDAiIHk9IjAiIGR5PSIuMzVlbSIgZm9udC1zaXplPSIxMnB4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgc3R5bGU9InRleHQtYW5jaG9yOiBzdGFydDsgZmlsbDogI2JlYzBjMjsiPjEgbmV3PC90ZXh0PjwvZz48bGluZSB4MT0iMCIgeTE9IjI5NSIgeDI9IjQ5MCIgeTI9IjAiIHN0eWxlPSJzdHJva2Utd2lkdGg6IDM7IHN0cm9rZTogI2ZmZjsiPjwvbGluZT48bGluZSB4MT0iMCIgeTE9IjI5NSIgeDI9IjQ5MCIgeTI9IjAiIHN0eWxlPSJzdHJva2Utd2lkdGg6IDE7IHN0cm9rZTogIzIyMjsiPjwvbGluZT48bGluZSB4MT0iNDkwIiB5MT0iMCIgeDI9IjQ5MCIgeTI9Ii0zNSIgc3R5bGU9InN0cm9rZS13aWR0aDogMzsgc3Ryb2tlOiAjZmZmOyI+PC9saW5lPjxsaW5lIHgxPSI0OTAiIHkxPSIwIiB4Mj0iNDkwIiB5Mj0iLTM1IiBzdHlsZT0ic3Ryb2tlLXdpZHRoOiAxOyBzdHJva2U6ICMyMjI7Ij48L2xpbmU+PHRleHQgeD0iNDg1IiB5PSItMzUiIGR5PSIuMzVlbSIgZm9udC1zaXplPSIxMiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIHN0eWxlPSJ0ZXh0LWFuY2hvcjogZW5kOyBmaWxsOiAjMjIyOyI+MjAxOC0wOS0xMjwvdGV4dD48bGluZSB4MT0iNTAiIHkxPSIyOTUiIHgyPSI1MCIgeTI9IjAiIHN0eWxlPSJzdHJva2Utd2lkdGg6IDM7IHN0cm9rZTogI2ZmZjsiPjwvbGluZT48bGluZSB4MT0iNTAiIHkxPSIyOTUiIHgyPSI1MCIgeTI9IjAiIHN0eWxlPSJzdHJva2Utd2lkdGg6IDE7IHN0cm9rZTogIzIyMjsiPjwvbGluZT48dGV4dCB4PSI1MCIgeT0iLTE1IiBkeT0iLjM1ZW0iIGZvbnQtc2l6ZT0iMTIiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBzdHlsZT0idGV4dC1hbmNob3I6IG1pZGRsZTsgZmlsbDogIzIyMjsiPjIwMTgtMDktMDQ8L3RleHQ+PGxpbmUgeDE9IjE1MCIgeTE9IjI5NSIgeDI9IjE1MCIgeTI9IjAiIHN0eWxlPSJzdHJva2Utd2lkdGg6IDM7IHN0cm9rZTogI2ZmZjsiPjwvbGluZT48bGluZSB4MT0iMTUwIiB5MT0iMjk1IiB4Mj0iMTUwIiB5Mj0iMCIgc3R5bGU9InN0cm9rZS13aWR0aDogMTsgc3Ryb2tlOiAjMjIyOyI+PC9saW5lPjx0ZXh0IHg9IjE1MCIgeT0iLTE1IiBkeT0iLjM1ZW0iIGZvbnQtc2l6ZT0iMTIiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBzdHlsZT0idGV4dC1hbmNob3I6IG1pZGRsZTsgZmlsbDogIzIyMjsiPjIwMTgtMDktMDY8L3RleHQ+PGxpbmUgeDE9IjI1MCIgeTE9IjI5NSIgeDI9IjI1MCIgeTI9IjAiIHN0eWxlPSJzdHJva2Utd2lkdGg6IDM7IHN0cm9rZTogI2ZmZjsiPjwvbGluZT48bGluZSB4MT0iMjUwIiB5MT0iMjk1IiB4Mj0iMjUwIiB5Mj0iMCIgc3R5bGU9InN0cm9rZS13aWR0aDogMTsgc3Ryb2tlOiAjMjIyOyI+PC9saW5lPjx0ZXh0IHg9IjI1MCIgeT0iLTE1IiBkeT0iLjM1ZW0iIGZvbnQtc2l6ZT0iMTIiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBzdHlsZT0idGV4dC1hbmNob3I6IG1pZGRsZTsgZmlsbDogIzIyMjsiPjIwMTgtMDktMDg8L3RleHQ+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwyOTUpIiBmaWxsPSJub25lIiBmb250LXNpemU9IjEwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+PHBhdGggY2xhc3M9ImRvbWFpbiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIGQ9Ik0wLjUsNlYwLjVINTUwLjVWNiIgc3R5bGU9InN0cm9rZTogIzIyMjsiPjwvcGF0aD48ZyBjbGFzcz0idGljayIgb3BhY2l0eT0iMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzAwLjUsMCkiPjxsaW5lIHN0cm9rZT0iY3VycmVudENvbG9yIiB5Mj0iNiIgc3R5bGU9InN0cm9rZTogIzIyMjsiPjwvbGluZT48dGV4dCBmaWxsPSJjdXJyZW50Q29sb3IiIHk9IjkiIGR5PSIwLjcxZW0iIHN0eWxlPSJmaWxsOiAjMjIyOyIgZm9udC1zaXplPSIxMnB4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+U2VwIDA5PC90ZXh0PjwvZz48L2c+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTUwICwwKSIgZmlsbD0ibm9uZSIgZm9udC1zaXplPSIxMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIHRleHQtYW5jaG9yPSJzdGFydCI+PHBhdGggY2xhc3M9ImRvbWFpbiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIGQ9Ik02LDI5NS41SDAuNVYwLjVINiIgc3R5bGU9InN0cm9rZTogIzIyMjsiPjwvcGF0aD48ZyBjbGFzcz0idGljayIgb3BhY2l0eT0iMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwyOTUuNSkiPjxsaW5lIHN0cm9rZT0iY3VycmVudENvbG9yIiB4Mj0iNiIgc3R5bGU9InN0cm9rZTogIzIyMjsiPjwvbGluZT48dGV4dCBmaWxsPSJjdXJyZW50Q29sb3IiIHg9IjkiIGR5PSIwLjMyZW0iIHN0eWxlPSJmaWxsOiAjMjIyOyIgZm9udC1zaXplPSIxMnB4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+MDwvdGV4dD48L2c+PGcgY2xhc3M9InRpY2siIG9wYWNpdHk9IjEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsMjUzLjM1NzE0Mjg1NzE0Mjg2KSI+PGxpbmUgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHgyPSI2IiBzdHlsZT0ic3Ryb2tlOiAjMjIyOyI+PC9saW5lPjx0ZXh0IGZpbGw9ImN1cnJlbnRDb2xvciIgeD0iOSIgZHk9IjAuMzJlbSIgc3R5bGU9ImZpbGw6ICMyMjI7IiBmb250LXNpemU9IjEycHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj4xPC90ZXh0PjwvZz48ZyBjbGFzcz0idGljayIgb3BhY2l0eT0iMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwyMTEuMjE0Mjg1NzE0Mjg1NzIpIj48bGluZSBzdHJva2U9ImN1cnJlbnRDb2xvciIgeDI9IjYiIHN0eWxlPSJzdHJva2U6ICMyMjI7Ij48L2xpbmU+PHRleHQgZmlsbD0iY3VycmVudENvbG9yIiB4PSI5IiBkeT0iMC4zMmVtIiBzdHlsZT0iZmlsbDogIzIyMjsiIGZvbnQtc2l6ZT0iMTJweCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPjI8L3RleHQ+PC9nPjxnIGNsYXNzPSJ0aWNrIiBvcGFjaXR5PSIxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLDE2OS4wNzE0Mjg1NzE0Mjg1OCkiPjxsaW5lIHN0cm9rZT0iY3VycmVudENvbG9yIiB4Mj0iNiIgc3R5bGU9InN0cm9rZTogIzIyMjsiPjwvbGluZT48dGV4dCBmaWxsPSJjdXJyZW50Q29sb3IiIHg9IjkiIGR5PSIwLjMyZW0iIHN0eWxlPSJmaWxsOiAjMjIyOyIgZm9udC1zaXplPSIxMnB4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+MzwvdGV4dD48L2c+PGcgY2xhc3M9InRpY2siIG9wYWNpdHk9IjEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsMTI2LjkyODU3MTQyODU3MTQ0KSI+PGxpbmUgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHgyPSI2IiBzdHlsZT0ic3Ryb2tlOiAjMjIyOyI+PC9saW5lPjx0ZXh0IGZpbGw9ImN1cnJlbnRDb2xvciIgeD0iOSIgZHk9IjAuMzJlbSIgc3R5bGU9ImZpbGw6ICMyMjI7IiBmb250LXNpemU9IjEycHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj40PC90ZXh0PjwvZz48ZyBjbGFzcz0idGljayIgb3BhY2l0eT0iMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCw4NC43ODU3MTQyODU3MTQyOCkiPjxsaW5lIHN0cm9rZT0iY3VycmVudENvbG9yIiB4Mj0iNiIgc3R5bGU9InN0cm9rZTogIzIyMjsiPjwvbGluZT48dGV4dCBmaWxsPSJjdXJyZW50Q29sb3IiIHg9IjkiIGR5PSIwLjMyZW0iIHN0eWxlPSJmaWxsOiAjMjIyOyIgZm9udC1zaXplPSIxMnB4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+NTwvdGV4dD48L2c+PGcgY2xhc3M9InRpY2siIG9wYWNpdHk9IjEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsNDIuNjQyODU3MTQyODU3MTcpIj48bGluZSBzdHJva2U9ImN1cnJlbnRDb2xvciIgeDI9IjYiIHN0eWxlPSJzdHJva2U6ICMyMjI7Ij48L2xpbmU+PHRleHQgZmlsbD0iY3VycmVudENvbG9yIiB4PSI5IiBkeT0iMC4zMmVtIiBzdHlsZT0iZmlsbDogIzIyMjsiIGZvbnQtc2l6ZT0iMTJweCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPjY8L3RleHQ+PC9nPjxnIGNsYXNzPSJ0aWNrIiBvcGFjaXR5PSIxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLDAuNSkiPjxsaW5lIHN0cm9rZT0iY3VycmVudENvbG9yIiB4Mj0iNiIgc3R5bGU9InN0cm9rZTogIzIyMjsiPjwvbGluZT48dGV4dCBmaWxsPSJjdXJyZW50Q29sb3IiIHg9IjkiIGR5PSIwLjMyZW0iIHN0eWxlPSJmaWxsOiAjMjIyOyIgZm9udC1zaXplPSIxMnB4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+NzwvdGV4dD48L2c+PC9nPjx0ZXh0IHg9IjUiIHk9Ii01NSIgZHk9Ii4zNWVtIiBmb250LXNpemU9IjEycHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBzdHlsZT0idGV4dC1hbmNob3I6IHN0YXJ0OyBmaWxsOiAjMjIyOyI+VGVzdGluZyB0aGUgY2ZkPC90ZXh0Pjx0ZXh0IHg9IjUiIHk9IjAiIGR5PSIxMnB4IiBmb250LXNpemU9IjEycHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBzdHlsZT0idGV4dC1hbmNob3I6IHN0YXJ0OyBmaWxsOiAjYmVjMGMyOyI+VG8gRG88L3RleHQ+PHRleHQgeD0iNSIgeT0iMTUiIGR5PSIxMnB4IiBmb250LXNpemU9IjEycHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBzdHlsZT0idGV4dC1hbmNob3I6IHN0YXJ0OyBmaWxsOiAjODA4Mjg1OyI+SW4gUHJvZ3Jlc3M8L3RleHQ+PHRleHQgeD0iNSIgeT0iMzAiIGR5PSIxMnB4IiBmb250LXNpemU9IjEycHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBzdHlsZT0idGV4dC1hbmNob3I6IHN0YXJ0OyBmaWxsOiAjMjIyOyI+RG9uZTwvdGV4dD48dGV4dCB4PSI2MDAiIHk9Ii0zNSIgZHk9Ii4zNWVtIiBmb250LXNpemU9IjEycHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBzdHlsZT0idGV4dC1hbmNob3I6IHN0YXJ0OyBmaWxsOiAjMjIyOyI+U3RvcnkgUG9pbnRzPC90ZXh0PjwvZz48L3N2Zz4=';
var settings = makeTestSettings();

// helper functions
function makeTestSettings() {
    settings = {};
    settings.data = makeTestData();
    settings.svg = JSDOM.fragment('<svg></svg>').firstChild;
    settings.predict = settings.data.entries[0].date;
    settings.markers = [{
        date: settings.data.entries[1].date
    }, {
        date: settings.data.entries[3].date
    }, {
        date: settings.data.entries[5].date
    }]
    let now = moment(NOW);
    settings.title = 'Testing the cfd'
    settings.fromDate = moment(now).subtract(8, 'days');
    settings.toDate = moment(now).add(3, 'days');
    return settings;
}

function makeTestData() {
    let testData = {};
    let now = moment(NOW);
    testData.toDo = ['new'];
    testData.progress = ['test', 'dev'];
    testData.done = ['done'];
    testData.unit = 'points';
    testData.entries = [];
    testData.entries.push({
        date: moment(now).subtract(8, 'days'),
        new: 0,
        dev: 0,
        test: 0,
        done: 0,
    }, {
            date: moment(now).subtract(7, 'days'),
            new: 1,
            dev: 0,
            test: 0,
            done: 0,
        }, {
            date: moment(now).subtract(6, 'days'),
            new: 1,
            dev: 1,
            test: 0,
            done: 0
        }, {
            date: moment(now).subtract(5, 'days'),
            new: 1,
            dev: 0,
            test: 1,
            done: 1
        }, {
            date: moment(now).subtract(4, 'days'),
            new: 2,
            dev: 1,
            test: 0,
            done: 2
        }, {
            date: moment(now).subtract(3, 'days'),
            new: 1,
            dev: 1,
            test: 2,
            done: 2
        }, {
            date: moment(now).subtract(2, 'days'),
            new: 0,
            dev: 0,
            test: 1,
            done: 5
        }, {
            date: moment(now).subtract(1, 'days'),
            new: 1,
            dev: 1,
            test: 0,
            done: 5
        }

    );
    return testData;
}


function writeTestFile(path, content) {
    fs.writeFile(path, content);
}

//test the functions

beforeEach(() => {
    settings = makeTestSettings();
});

test('validate settings', () => {

    //no settings at all
    let diagram = cfd();
    expect(() => diagram.draw())
        .toThrow(/No settings/);

    //empty settings
    let settings = {};
    diagram = cfd(settings);

    expect(() => {
        diagram.draw()
    }).toThrow(/No svg/);

    settings.svg = JSDOM.fragment('<div></div>').firstChild;

    expect(() => {
        diagram.draw()
    }).toThrow(/No svg/);
});

test('validate margins', () => {
    let diagram = cfd(settings);
    diagram.draw();
    expect(settings.width)
        .toBe(800);
    expect(settings.height)
        .toBe(400);
    expect(settings.innerWidth)
        .toBe(800 - settings.margin.left - settings.margin.right);
    expect(settings.innerHeight)
        .toBe(400 - settings.margin.top - settings.margin.bottom);
    expect(settings.margin.top)
        .toBe(75);
    expect(settings.margin.right)
        .toBe(210);
    expect(settings.margin.bottom)
        .toBe(30);
    expect(settings.margin.left)
        .toBe(40);
});

test('validate draw options', () => {
    let diagram = cfd(settings);
    diagram.draw();
    expect(settings.drawOptions).toEqual(['axis', 'legend', 'markers', 'predict']);

    delete settings.drawOptions;
    diagram.draw();
    expect(settings.drawOptions).toEqual(['axis', 'legend', 'markers', 'predict']);

    settings.drawOptions = [];
    diagram.draw();
    expect(settings.drawOptions).toEqual([]);

    settings.drawOptions = ['axis'];
    diagram.draw();
    expect(settings.drawOptions).toEqual(['axis']);

    settings.drawOptions = ['legend'];
    diagram.draw();
    expect(settings.drawOptions).toEqual(['legend']);

    settings.drawOptions = ['markers'];
    diagram.draw();
    expect(settings.drawOptions).toEqual(['markers']);

    settings.drawOptions = ['predict'];
    diagram.draw();
    expect(settings.drawOptions).toEqual(['predict']);
});

test('validate style', () => {
    let diagram = cfd(settings);
    diagram.draw();
    let color = '#222';
    let background = '#fff';
    let toDo = '#bec0c2';
    let progress = '#808285';
    let done = '#222';
    expect(settings.style.fontSize).toBe(12);
    expect(settings.style.fontFamily).toBe('sans-serif');
    expect(settings.style.color).toBe(color);
    expect(settings.style.backgroundColor).toBe(background);
    expect(settings.style.axis.color).toBe(color);
    expect(settings.style.toDo.color).toBe(toDo);
    expect(settings.style.toDo.stroke).toBe(background);
    expect(settings.style.progress.color).toBe(progress);
    expect(settings.style.progress.stroke).toBe(background);
    expect(settings.style.done.color).toBe(done);
    expect(settings.style.done.stroke).toBe(background);
    expect(settings.style.predict.backgroundColor).toBe(background);
    expect(settings.style.predict.color).toBe(done);
    expect(settings.style.marker.backgroundColor).toBe(background);
    expect(settings.style.marker.color).toBe(color);

    color = 'red';
    background = 'lightgray';
    diagram.settings.style = {
        fontSize: 16,
        fontFamily: 'serif',
        color: color,
        backgroundColor: background,
    };

    diagram.draw();
    expect(settings.style.fontSize).toBe(16);
    expect(settings.style.fontFamily).toBe('serif');
    expect(settings.style.color).toBe(color);
    expect(settings.style.backgroundColor).toBe(background);
    expect(settings.style.axis.color).toBe(color);
    expect(settings.style.toDo.color).toBe(toDo);
    expect(settings.style.toDo.stroke).toBe(background);
    expect(settings.style.progress.color).toBe(progress);
    expect(settings.style.progress.stroke).toBe(background);
    expect(settings.style.done.color).toBe(done);
    expect(settings.style.done.stroke).toBe(background);
    expect(settings.style.predict.backgroundColor).toBe(background);
    expect(settings.style.predict.color).toBe(done);
    expect(settings.style.marker.backgroundColor).toBe(background);
    expect(settings.style.marker.color).toBe(color);


    color = '#333';
    background = '#eee';
    toDo = '#aaa';
    progress = '#bbb';
    done = '#ccc';
    diagram.settings.style = {
        color: color,
        backgroundColor: background
    };
    diagram.settings.style.toDo = {
        color: toDo
    };
    diagram.settings.style.progress = {
        color: progress
    };
    diagram.settings.style.done = {
        color: done
    };
    diagram.settings.style.predict = {
        color: progress
    };
    diagram.settings.style.marker = {
        color: toDo
    }
    diagram.draw();
    expect(settings.style.fontSize).toBe(12);
    expect(settings.style.fontFamily).toBe('sans-serif');
    expect(settings.style.color).toBe(color);
    expect(settings.style.backgroundColor).toBe(background);
    expect(settings.style.axis.color).toBe(color);
    expect(settings.style.toDo.color).toBe(toDo);
    expect(settings.style.toDo.stroke).toBe(background);
    expect(settings.style.progress.color).toBe(progress);
    expect(settings.style.progress.stroke).toBe(background);
    expect(settings.style.done.color).toBe(done);
    expect(settings.style.done.stroke).toBe(background);
    expect(settings.style.predict.backgroundColor).toBe(background);
    expect(settings.style.predict.color).toBe(progress);
    expect(settings.style.marker.backgroundColor).toBe(background);
    expect(settings.style.marker.color).toBe(toDo);

    diagram.settings.style = {};
    color = '#222';
    background = '#fff';
    toDo = '#bec0c2';
    progress = '#808285';
    done = '#222';
    diagram.settings.style.toDo = {
        stroke: toDo
    };
    diagram.settings.style.progress = {
        stroke: progress
    };
    diagram.settings.style.done = {
        stroke: done
    };
    diagram.draw();
    expect(settings.style.fontSize).toBe(12);
    expect(settings.style.fontFamily).toBe('sans-serif');
    expect(settings.style.color).toBe(color);
    expect(settings.style.backgroundColor).toBe(background);
    expect(settings.style.axis.color).toBe(color);
    expect(settings.style.toDo.color).toBe(toDo);
    expect(settings.style.toDo.stroke).toBe(toDo);
    expect(settings.style.progress.color).toBe(progress);
    expect(settings.style.progress.stroke).toBe(progress);
    expect(settings.style.done.color).toBe(done);
    expect(settings.style.done.stroke).toBe(done);
    expect(settings.style.predict.backgroundColor).toBe(background);
    expect(settings.style.predict.color).toBe(color);
    expect(settings.style.marker.backgroundColor).toBe(background);
    expect(settings.style.marker.color).toBe(color);

});


test('validate data', () => {
    delete settings.data;

    let diagram = cfd(settings);

    expect(() => {
        diagram.draw()
    }).toThrow(/No data/);

    settings.data = {
        entries: []
    }
    expect(() => {
        diagram.draw()
    }).toThrow(/Empty data entries/);

    settings.data.entries = {}
    expect(() => {
        diagram.draw()
    }).toThrow(/Data entries not an array/);
});

test('validate image', () => {
    let diagram = cfd(settings);
    let svg = diagram.image();
    let testFileContent = '<!DOCTYPE html>\n<meta charset="utf-8">\n<img src="' + svg + '"/>';
    writeTestFile('./cfd.html', testFileContent);

    expect(svg).toBe(IMAGE);

    //look at ./cfd.html to view the result
});