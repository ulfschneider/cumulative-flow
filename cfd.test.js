'use babel'

const fs = require('fs');
const jsdom = require('jsdom');
const {
    JSDOM
} = jsdom;
const cfd = require('cumulative-flow');
const moment = require('moment');

const NOW = '2018-09-11';
const IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0MCw3NSkiPjxnIGNsYXNzPSJsYXllciI+PHBhdGggY2xhc3M9ImFyZWEiIHN0eWxlPSJmaWxsOiAjMjIyOyBzdHJva2U6ICNmZmY7IHN0cm9rZS13aWR0aDogLjU7IiBkPSJNMCwyOTVMNTAsMjk1TDEwMCwyOTVMMTUwLDI1Mi44NTcxNDI4NTcxNDI4NkwyMDAsMjEwLjcxNDI4NTcxNDI4NTcyTDI1MCwyMTAuNzE0Mjg1NzE0Mjg1NzJMMzAwLDg0LjI4NTcxNDI4NTcxNDI4TDM1MCw4NC4yODU3MTQyODU3MTQyOEwzNTAsMjk1TDMwMCwyOTVMMjUwLDI5NUwyMDAsMjk1TDE1MCwyOTVMMTAwLDI5NUw1MCwyOTVMMCwyOTVaIj48L3BhdGg+PHRleHQgeD0iNjAwIiB5PSI4NC4yODU3MTQyODU3MTQyOCIgZHk9IjRweCIgZm9udC1zaXplPSIxMnB4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgc3R5bGU9InRleHQtYW5jaG9yOiBzdGFydDsgZmlsbDogIzIyMjsiPjUgZG9uZTwvdGV4dD48L2c+PGcgY2xhc3M9ImxheWVyIj48cGF0aCBjbGFzcz0iYXJlYSIgc3R5bGU9ImZpbGw6ICM4MDgyODU7IHN0cm9rZTogI2ZmZjsgc3Ryb2tlLXdpZHRoOiAuNTsiIGQ9Ik0wLDI5NUw1MCwyOTVMMTAwLDI5NUwxNTAsMjEwLjcxNDI4NTcxNDI4NTcyTDIwMCwyMTAuNzE0Mjg1NzE0Mjg1NzJMMjUwLDEyNi40Mjg1NzE0Mjg1NzE0NEwzMDAsNDIuMTQyODU3MTQyODU3MTdMMzUwLDg0LjI4NTcxNDI4NTcxNDI4TDM1MCw4NC4yODU3MTQyODU3MTQyOEwzMDAsODQuMjg1NzE0Mjg1NzE0MjhMMjUwLDIxMC43MTQyODU3MTQyODU3MkwyMDAsMjEwLjcxNDI4NTcxNDI4NTcyTDE1MCwyNTIuODU3MTQyODU3MTQyODZMMTAwLDI5NUw1MCwyOTVMMCwyOTVaIj48L3BhdGg+PC9nPjxnIGNsYXNzPSJsYXllciI+PHBhdGggY2xhc3M9ImFyZWEiIHN0eWxlPSJmaWxsOiAjODA4Mjg1OyBzdHJva2U6ICNmZmY7IHN0cm9rZS13aWR0aDogLjU7IiBkPSJNMCwyOTVMNTAsMjk1TDEwMCwyNTIuODU3MTQyODU3MTQyODZMMTUwLDIxMC43MTQyODU3MTQyODU3MkwyMDAsMTY4LjU3MTQyODU3MTQyODU4TDI1MCw4NC4yODU3MTQyODU3MTQyOEwzMDAsNDIuMTQyODU3MTQyODU3MTdMMzUwLDQyLjE0Mjg1NzE0Mjg1NzE3TDM1MCw4NC4yODU3MTQyODU3MTQyOEwzMDAsNDIuMTQyODU3MTQyODU3MTdMMjUwLDEyNi40Mjg1NzE0Mjg1NzE0NEwyMDAsMjEwLjcxNDI4NTcxNDI4NTcyTDE1MCwyMTAuNzE0Mjg1NzE0Mjg1NzJMMTAwLDI5NUw1MCwyOTVMMCwyOTVaIj48L3BhdGg+PHRleHQgeD0iNjAwIiB5PSI0Mi4xNDI4NTcxNDI4NTcxNyIgZHk9IjRweCIgZm9udC1zaXplPSIxMnB4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgc3R5bGU9InRleHQtYW5jaG9yOiBzdGFydDsgZmlsbDogIzgwODI4NTsiPjEgZGV2PC90ZXh0PjwvZz48ZyBjbGFzcz0ibGF5ZXIiPjxwYXRoIGNsYXNzPSJhcmVhIiBzdHlsZT0iZmlsbDogI2JlYzBjMjsgc3Ryb2tlOiAjZmZmOyBzdHJva2Utd2lkdGg6IC41OyIgZD0iTTAsMjk1TDUwLDI1Mi44NTcxNDI4NTcxNDI4NkwxMDAsMjEwLjcxNDI4NTcxNDI4NTcyTDE1MCwxNjguNTcxNDI4NTcxNDI4NThMMjAwLDg0LjI4NTcxNDI4NTcxNDI4TDI1MCw0Mi4xNDI4NTcxNDI4NTcxN0wzMDAsNDIuMTQyODU3MTQyODU3MTdMMzUwLDBMMzUwLDQyLjE0Mjg1NzE0Mjg1NzE3TDMwMCw0Mi4xNDI4NTcxNDI4NTcxN0wyNTAsODQuMjg1NzE0Mjg1NzE0MjhMMjAwLDE2OC41NzE0Mjg1NzE0Mjg1OEwxNTAsMjEwLjcxNDI4NTcxNDI4NTcyTDEwMCwyNTIuODU3MTQyODU3MTQyODZMNTAsMjk1TDAsMjk1WiI+PC9wYXRoPjx0ZXh0IHg9IjYwMCIgeT0iMCIgZHk9IjRweCIgZm9udC1zaXplPSIxMnB4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgc3R5bGU9InRleHQtYW5jaG9yOiBzdGFydDsgZmlsbDogI2JlYzBjMjsiPjEgbmV3PC90ZXh0PjwvZz48bGluZSB4MT0iMCIgeTE9IjI5NSIgeDI9IjQ5MCIgeTI9IjAiIHN0eWxlPSJzdHJva2Utd2lkdGg6IDM7IHN0cm9rZTogI2ZmZjsiPjwvbGluZT48bGluZSB4MT0iMCIgeTE9IjI5NSIgeDI9IjQ5MCIgeTI9IjAiIHN0eWxlPSJzdHJva2Utd2lkdGg6IDE7IHN0cm9rZTogIzIyMjsiPjwvbGluZT48bGluZSB4MT0iNDkwIiB5MT0iMCIgeDI9IjQ5MCIgeTI9Ii0zNSIgc3R5bGU9InN0cm9rZS13aWR0aDogMzsgc3Ryb2tlOiAjZmZmOyI+PC9saW5lPjxsaW5lIHgxPSI0OTAiIHkxPSIwIiB4Mj0iNDkwIiB5Mj0iLTM1IiBzdHlsZT0ic3Ryb2tlLXdpZHRoOiAxOyBzdHJva2U6ICMyMjI7Ij48L2xpbmU+PHRleHQgeD0iNDg1IiB5PSItMzUiIGR5PSI0cHgiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBzdHlsZT0idGV4dC1hbmNob3I6IGVuZDsgZmlsbDogIzIyMjsiPjIwMTgtMDktMTI8L3RleHQ+PGxpbmUgeDE9IjUwIiB5MT0iMjk1IiB4Mj0iNTAiIHkyPSIwIiBzdHlsZT0ic3Ryb2tlLXdpZHRoOiAzOyBzdHJva2U6ICNmZmY7Ij48L2xpbmU+PGxpbmUgeDE9IjUwIiB5MT0iMjk1IiB4Mj0iNTAiIHkyPSIwIiBzdHlsZT0ic3Ryb2tlLXdpZHRoOiAxOyBzdHJva2U6ICMyMjI7Ij48L2xpbmU+PHRleHQgeD0iNTAiIHk9Ii0xNSIgZHk9IjRweCIgZm9udC1zaXplPSIxMiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIHN0eWxlPSJ0ZXh0LWFuY2hvcjogbWlkZGxlOyBmaWxsOiAjMjIyOyI+MjAxOC0wOS0wNDwvdGV4dD48bGluZSB4MT0iMTUwIiB5MT0iMjk1IiB4Mj0iMTUwIiB5Mj0iMCIgc3R5bGU9InN0cm9rZS13aWR0aDogMzsgc3Ryb2tlOiAjZmZmOyI+PC9saW5lPjxsaW5lIHgxPSIxNTAiIHkxPSIyOTUiIHgyPSIxNTAiIHkyPSIwIiBzdHlsZT0ic3Ryb2tlLXdpZHRoOiAxOyBzdHJva2U6ICMyMjI7Ij48L2xpbmU+PHRleHQgeD0iMTUwIiB5PSItMTUiIGR5PSI0cHgiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBzdHlsZT0idGV4dC1hbmNob3I6IG1pZGRsZTsgZmlsbDogIzIyMjsiPjIwMTgtMDktMDY8L3RleHQ+PGxpbmUgeDE9IjI1MCIgeTE9IjI5NSIgeDI9IjI1MCIgeTI9IjAiIHN0eWxlPSJzdHJva2Utd2lkdGg6IDM7IHN0cm9rZTogI2ZmZjsiPjwvbGluZT48bGluZSB4MT0iMjUwIiB5MT0iMjk1IiB4Mj0iMjUwIiB5Mj0iMCIgc3R5bGU9InN0cm9rZS13aWR0aDogMTsgc3Ryb2tlOiAjMjIyOyI+PC9saW5lPjx0ZXh0IHg9IjI1MCIgeT0iLTE1IiBkeT0iNHB4IiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgc3R5bGU9InRleHQtYW5jaG9yOiBtaWRkbGU7IGZpbGw6ICMyMjI7Ij4yMDE4LTA5LTA4PC90ZXh0PjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsMjk1KSIgZmlsbD0ibm9uZSIgZm9udC1zaXplPSIxMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjxwYXRoIGNsYXNzPSJkb21haW4iIHN0cm9rZT0iY3VycmVudENvbG9yIiBkPSJNMC41LDZWMC41SDU1MC41VjYiIHN0eWxlPSJzdHJva2U6ICMyMjI7Ij48L3BhdGg+PGcgY2xhc3M9InRpY2siIG9wYWNpdHk9IjEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMwMC41LDApIj48bGluZSBzdHJva2U9ImN1cnJlbnRDb2xvciIgeTI9IjYiIHN0eWxlPSJzdHJva2U6ICMyMjI7Ij48L2xpbmU+PHRleHQgZmlsbD0iY3VycmVudENvbG9yIiB5PSI5IiBkeT0iMC43MWVtIiBzdHlsZT0iZmlsbDogIzIyMjsiIGZvbnQtc2l6ZT0iMTJweCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPlNlcCAwOTwvdGV4dD48L2c+PC9nPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDU1MCAsMCkiIGZpbGw9Im5vbmUiIGZvbnQtc2l6ZT0iMTAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiB0ZXh0LWFuY2hvcj0ic3RhcnQiPjxwYXRoIGNsYXNzPSJkb21haW4iIHN0cm9rZT0iY3VycmVudENvbG9yIiBkPSJNNiwyOTUuNUgwLjVWMC41SDYiIHN0eWxlPSJzdHJva2U6ICMyMjI7Ij48L3BhdGg+PGcgY2xhc3M9InRpY2siIG9wYWNpdHk9IjEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsMjk1LjUpIj48bGluZSBzdHJva2U9ImN1cnJlbnRDb2xvciIgeDI9IjYiIHN0eWxlPSJzdHJva2U6ICMyMjI7Ij48L2xpbmU+PHRleHQgZmlsbD0iY3VycmVudENvbG9yIiB4PSI5IiBkeT0iMC4zMmVtIiBzdHlsZT0iZmlsbDogIzIyMjsiIGZvbnQtc2l6ZT0iMTJweCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPjA8L3RleHQ+PC9nPjxnIGNsYXNzPSJ0aWNrIiBvcGFjaXR5PSIxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLDI1My4zNTcxNDI4NTcxNDI4NikiPjxsaW5lIHN0cm9rZT0iY3VycmVudENvbG9yIiB4Mj0iNiIgc3R5bGU9InN0cm9rZTogIzIyMjsiPjwvbGluZT48dGV4dCBmaWxsPSJjdXJyZW50Q29sb3IiIHg9IjkiIGR5PSIwLjMyZW0iIHN0eWxlPSJmaWxsOiAjMjIyOyIgZm9udC1zaXplPSIxMnB4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+MTwvdGV4dD48L2c+PGcgY2xhc3M9InRpY2siIG9wYWNpdHk9IjEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsMjExLjIxNDI4NTcxNDI4NTcyKSI+PGxpbmUgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHgyPSI2IiBzdHlsZT0ic3Ryb2tlOiAjMjIyOyI+PC9saW5lPjx0ZXh0IGZpbGw9ImN1cnJlbnRDb2xvciIgeD0iOSIgZHk9IjAuMzJlbSIgc3R5bGU9ImZpbGw6ICMyMjI7IiBmb250LXNpemU9IjEycHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj4yPC90ZXh0PjwvZz48ZyBjbGFzcz0idGljayIgb3BhY2l0eT0iMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwxNjkuMDcxNDI4NTcxNDI4NTgpIj48bGluZSBzdHJva2U9ImN1cnJlbnRDb2xvciIgeDI9IjYiIHN0eWxlPSJzdHJva2U6ICMyMjI7Ij48L2xpbmU+PHRleHQgZmlsbD0iY3VycmVudENvbG9yIiB4PSI5IiBkeT0iMC4zMmVtIiBzdHlsZT0iZmlsbDogIzIyMjsiIGZvbnQtc2l6ZT0iMTJweCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPjM8L3RleHQ+PC9nPjxnIGNsYXNzPSJ0aWNrIiBvcGFjaXR5PSIxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLDEyNi45Mjg1NzE0Mjg1NzE0NCkiPjxsaW5lIHN0cm9rZT0iY3VycmVudENvbG9yIiB4Mj0iNiIgc3R5bGU9InN0cm9rZTogIzIyMjsiPjwvbGluZT48dGV4dCBmaWxsPSJjdXJyZW50Q29sb3IiIHg9IjkiIGR5PSIwLjMyZW0iIHN0eWxlPSJmaWxsOiAjMjIyOyIgZm9udC1zaXplPSIxMnB4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+NDwvdGV4dD48L2c+PGcgY2xhc3M9InRpY2siIG9wYWNpdHk9IjEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsODQuNzg1NzE0Mjg1NzE0MjgpIj48bGluZSBzdHJva2U9ImN1cnJlbnRDb2xvciIgeDI9IjYiIHN0eWxlPSJzdHJva2U6ICMyMjI7Ij48L2xpbmU+PHRleHQgZmlsbD0iY3VycmVudENvbG9yIiB4PSI5IiBkeT0iMC4zMmVtIiBzdHlsZT0iZmlsbDogIzIyMjsiIGZvbnQtc2l6ZT0iMTJweCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPjU8L3RleHQ+PC9nPjxnIGNsYXNzPSJ0aWNrIiBvcGFjaXR5PSIxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLDQyLjY0Mjg1NzE0Mjg1NzE3KSI+PGxpbmUgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHgyPSI2IiBzdHlsZT0ic3Ryb2tlOiAjMjIyOyI+PC9saW5lPjx0ZXh0IGZpbGw9ImN1cnJlbnRDb2xvciIgeD0iOSIgZHk9IjAuMzJlbSIgc3R5bGU9ImZpbGw6ICMyMjI7IiBmb250LXNpemU9IjEycHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj42PC90ZXh0PjwvZz48ZyBjbGFzcz0idGljayIgb3BhY2l0eT0iMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwwLjUpIj48bGluZSBzdHJva2U9ImN1cnJlbnRDb2xvciIgeDI9IjYiIHN0eWxlPSJzdHJva2U6ICMyMjI7Ij48L2xpbmU+PHRleHQgZmlsbD0iY3VycmVudENvbG9yIiB4PSI5IiBkeT0iMC4zMmVtIiBzdHlsZT0iZmlsbDogIzIyMjsiIGZvbnQtc2l6ZT0iMTJweCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPjc8L3RleHQ+PC9nPjwvZz48dGV4dCB4PSI1IiB5PSItNTUiIGR5PSI0cHgiIGZvbnQtc2l6ZT0iMTJweCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIHN0eWxlPSJ0ZXh0LWFuY2hvcjogc3RhcnQ7IGZpbGw6ICMyMjI7Ij5UZXN0aW5nIHRoZSBjZmQ8L3RleHQ+PHRleHQgeD0iNSIgeT0iMTIiIGR5PSI0cHgiIGZvbnQtc2l6ZT0iMTJweCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIHN0eWxlPSJ0ZXh0LWFuY2hvcjogc3RhcnQ7IGZpbGw6ICNiZWMwYzI7Ij5UbyBEbzwvdGV4dD48dGV4dCB4PSI1IiB5PSIyNCIgZHk9IjRweCIgZm9udC1zaXplPSIxMnB4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgc3R5bGU9InRleHQtYW5jaG9yOiBzdGFydDsgZmlsbDogIzgwODI4NTsiPkluIFByb2dyZXNzPC90ZXh0Pjx0ZXh0IHg9IjUiIHk9IjM2IiBkeT0iNHB4IiBmb250LXNpemU9IjEycHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBzdHlsZT0idGV4dC1hbmNob3I6IHN0YXJ0OyBmaWxsOiAjMjIyOyI+RG9uZTwvdGV4dD48dGV4dCB4PSI2MDAiIHk9Ii0zNSIgZHk9IjRweCIgZm9udC1zaXplPSIxMnB4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgc3R5bGU9InRleHQtYW5jaG9yOiBzdGFydDsgZmlsbDogIzIyMjsiPlN0b3J5IFBvaW50czwvdGV4dD48L2c+PC9zdmc+';
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

    expect(settings.margin.top)
        .toBe(75);
    expect(settings.margin.right)
        .toBe(210);
    expect(settings.margin.bottom)
        .toBe(30);
    expect(settings.margin.left)
        .toBe(40);
    expect(settings.innerWidth)
        .toBe(800 - settings.margin.left - settings.margin.right);
    expect(settings.innerHeight)
        .toBe(400 - settings.margin.top - settings.margin.bottom);

    delete settings.margin;
    settings.margin = { top: 50 };
    diagram.draw();
    expect(settings.margin.top)
        .toBe(50);
    expect(settings.margin.right)
        .toBe(210);
    expect(settings.margin.bottom)
        .toBe(30);
    expect(settings.margin.left)
        .toBe(40);
    expect(settings.innerWidth)
        .toBe(800 - settings.margin.left - settings.margin.right);
    expect(settings.innerHeight)
        .toBe(400 - settings.margin.top - settings.margin.bottom);

    delete settings.margin;
    settings.margin = { left: 50 };
    diagram.draw();
    expect(settings.margin.top)
        .toBe(75);
    expect(settings.margin.right)
        .toBe(210);
    expect(settings.margin.bottom)
        .toBe(30);
    expect(settings.margin.left)
        .toBe(50);
    expect(settings.innerWidth)
        .toBe(800 - settings.margin.left - settings.margin.right);
    expect(settings.innerHeight)
        .toBe(400 - settings.margin.top - settings.margin.bottom);

    delete settings.margin;
    settings.margin = { right: 50 };
    diagram.draw();
    expect(settings.margin.top)
        .toBe(75);
    expect(settings.margin.right)
        .toBe(50);
    expect(settings.margin.bottom)
        .toBe(30);
    expect(settings.margin.left)
        .toBe(40);
    expect(settings.innerWidth)
        .toBe(800 - settings.margin.left - settings.margin.right);
    expect(settings.innerHeight)
        .toBe(400 - settings.margin.top - settings.margin.bottom);

    delete settings.margin;
    settings.margin = { bottom: 50 };
    diagram.draw();
    expect(settings.margin.top)
        .toBe(75);
    expect(settings.margin.right)
        .toBe(210);
    expect(settings.margin.bottom)
        .toBe(50);
    expect(settings.margin.left)
        .toBe(40);
    expect(settings.innerWidth)
        .toBe(800 - settings.margin.left - settings.margin.right);
    expect(settings.innerHeight)
        .toBe(400 - settings.margin.top - settings.margin.bottom);
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
    diagram.settings.style.axis = {};
    diagram.settings.style.predict = {};
    diagram.settings.style.marker = {};
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

    let diagram = cfd(settings);
    delete settings.data;
    expect(() => {
        diagram.draw()
    }).toThrow(/No data/);

    settings = makeTestSettings();
    delete settings.data.entries;
    diagram = cfd(settings);
    expect(() => {
        diagram.draw()
    }).toThrow(/No data entries/);

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

    settings = makeTestSettings();
    diagram = cfd(settings);
    delete settings.data.toDo;
    expect(() => {
        diagram.draw();
    }).toThrow(/No toDo status defined/);

    settings = makeTestSettings();
    diagram = cfd(settings);
    delete settings.data.progress;
    expect(() => {
        diagram.draw();
    }).toThrow(/No progress status defined/);

    settings = makeTestSettings();
    diagram = cfd(settings);
    delete settings.data.done;
    expect(() => {
        diagram.draw();
    }).toThrow(/No done status defined/);


});

test('validate image', () => {
    let diagram = cfd(settings);
    let svg = diagram.image();
    let testFileContent = '<!DOCTYPE html>\n<meta charset="utf-8">\n<img src="' + svg + '"/>';
    writeTestFile('./cfd.html', testFileContent);

    expect(svg).toBe(IMAGE);

    //have a look at ./cfd.html to view the result
});