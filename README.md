[![Build Status](https://travis-ci.com/ulfschneider/cumulative-flow.svg?branch=master)](https://travis-ci.com/ulfschneider/cumulative-flow) [![Coverage Status](https://coveralls.io/repos/github/ulfschneider/cumulative-flow/badge.svg?branch=master)](https://coveralls.io/github/ulfschneider/cumulative-flow?branch=master) [![npm version](https://badge.fury.io/js/cumulative-flow.svg)](https://badge.fury.io/js/cumulative-flow)

# Cumulative Flow Diagram

Draw SVG Cumulative Flow Diagrams and use the option to indicate the anticipated completion of work.

<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0MCw3NSkiPjxnIGNsYXNzPSJsYXllciI+PHBhdGggY2xhc3M9ImFyZWEiIHN0eWxlPSJmaWxsOiAjMjIyOyBzdHJva2U6ICNmZmY7IHN0cm9rZS13aWR0aDogLjU7IiBkPSJNMCwyOTVMNTAsMjk1TDEwMCwyOTVMMTUwLDI1Mi44NTcxNDI4NTcxNDI4NkwyMDAsMjEwLjcxNDI4NTcxNDI4NTcyTDI1MCwyMTAuNzE0Mjg1NzE0Mjg1NzJMMzAwLDg0LjI4NTcxNDI4NTcxNDI4TDM1MCw4NC4yODU3MTQyODU3MTQyOEwzNTAsMjk1TDMwMCwyOTVMMjUwLDI5NUwyMDAsMjk1TDE1MCwyOTVMMTAwLDI5NUw1MCwyOTVMMCwyOTVaIj48L3BhdGg+PHRleHQgeD0iNjAwIiB5PSI4NC4yODU3MTQyODU3MTQyOCIgZHk9IjRweCIgZm9udC1zaXplPSIxMnB4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgc3R5bGU9InRleHQtYW5jaG9yOiBzdGFydDsgZmlsbDogIzIyMjsiPjUgZG9uZTwvdGV4dD48L2c+PGcgY2xhc3M9ImxheWVyIj48cGF0aCBjbGFzcz0iYXJlYSIgc3R5bGU9ImZpbGw6ICM4MDgyODU7IHN0cm9rZTogI2ZmZjsgc3Ryb2tlLXdpZHRoOiAuNTsiIGQ9Ik0wLDI5NUw1MCwyOTVMMTAwLDI5NUwxNTAsMjEwLjcxNDI4NTcxNDI4NTcyTDIwMCwyMTAuNzE0Mjg1NzE0Mjg1NzJMMjUwLDEyNi40Mjg1NzE0Mjg1NzE0NEwzMDAsNDIuMTQyODU3MTQyODU3MTdMMzUwLDg0LjI4NTcxNDI4NTcxNDI4TDM1MCw4NC4yODU3MTQyODU3MTQyOEwzMDAsODQuMjg1NzE0Mjg1NzE0MjhMMjUwLDIxMC43MTQyODU3MTQyODU3MkwyMDAsMjEwLjcxNDI4NTcxNDI4NTcyTDE1MCwyNTIuODU3MTQyODU3MTQyODZMMTAwLDI5NUw1MCwyOTVMMCwyOTVaIj48L3BhdGg+PC9nPjxnIGNsYXNzPSJsYXllciI+PHBhdGggY2xhc3M9ImFyZWEiIHN0eWxlPSJmaWxsOiAjODA4Mjg1OyBzdHJva2U6ICNmZmY7IHN0cm9rZS13aWR0aDogLjU7IiBkPSJNMCwyOTVMNTAsMjk1TDEwMCwyNTIuODU3MTQyODU3MTQyODZMMTUwLDIxMC43MTQyODU3MTQyODU3MkwyMDAsMTY4LjU3MTQyODU3MTQyODU4TDI1MCw4NC4yODU3MTQyODU3MTQyOEwzMDAsNDIuMTQyODU3MTQyODU3MTdMMzUwLDQyLjE0Mjg1NzE0Mjg1NzE3TDM1MCw4NC4yODU3MTQyODU3MTQyOEwzMDAsNDIuMTQyODU3MTQyODU3MTdMMjUwLDEyNi40Mjg1NzE0Mjg1NzE0NEwyMDAsMjEwLjcxNDI4NTcxNDI4NTcyTDE1MCwyMTAuNzE0Mjg1NzE0Mjg1NzJMMTAwLDI5NUw1MCwyOTVMMCwyOTVaIj48L3BhdGg+PHRleHQgeD0iNjAwIiB5PSI0Mi4xNDI4NTcxNDI4NTcxNyIgZHk9IjRweCIgZm9udC1zaXplPSIxMnB4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgc3R5bGU9InRleHQtYW5jaG9yOiBzdGFydDsgZmlsbDogIzgwODI4NTsiPjEgZGV2PC90ZXh0PjwvZz48ZyBjbGFzcz0ibGF5ZXIiPjxwYXRoIGNsYXNzPSJhcmVhIiBzdHlsZT0iZmlsbDogI2JlYzBjMjsgc3Ryb2tlOiAjZmZmOyBzdHJva2Utd2lkdGg6IC41OyIgZD0iTTAsMjk1TDUwLDI1Mi44NTcxNDI4NTcxNDI4NkwxMDAsMjEwLjcxNDI4NTcxNDI4NTcyTDE1MCwxNjguNTcxNDI4NTcxNDI4NThMMjAwLDg0LjI4NTcxNDI4NTcxNDI4TDI1MCw0Mi4xNDI4NTcxNDI4NTcxN0wzMDAsNDIuMTQyODU3MTQyODU3MTdMMzUwLDBMMzUwLDQyLjE0Mjg1NzE0Mjg1NzE3TDMwMCw0Mi4xNDI4NTcxNDI4NTcxN0wyNTAsODQuMjg1NzE0Mjg1NzE0MjhMMjAwLDE2OC41NzE0Mjg1NzE0Mjg1OEwxNTAsMjEwLjcxNDI4NTcxNDI4NTcyTDEwMCwyNTIuODU3MTQyODU3MTQyODZMNTAsMjk1TDAsMjk1WiI+PC9wYXRoPjx0ZXh0IHg9IjYwMCIgeT0iMCIgZHk9IjRweCIgZm9udC1zaXplPSIxMnB4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgc3R5bGU9InRleHQtYW5jaG9yOiBzdGFydDsgZmlsbDogI2JlYzBjMjsiPjEgbmV3PC90ZXh0PjwvZz48cGF0aCBkPSJNMCwyOTVMNDg4LDEuMjA0MDgxNjMyNjUzMDcxN0w0ODgsLTM1IiBmaWxsPSJub25lIiBzdHlsZT0ic3Ryb2tlLXdpZHRoOiAzOyBzdHJva2U6ICNmZmY7Ij48L3BhdGg+PHBhdGggZD0iTTAsMjk1TDQ4OCwxLjIwNDA4MTYzMjY1MzA3MTdMNDg4LC0zNSIgZmlsbD0ibm9uZSIgc3R5bGU9InN0cm9rZS13aWR0aDogMTsgc3Ryb2tlOiAjMjIyOyI+PC9wYXRoPjx0ZXh0IHg9IjQ4MyIgeT0iLTM1IiBkeT0iNHB4IiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgc3R5bGU9InRleHQtYW5jaG9yOiBlbmQ7IGZpbGw6ICMyMjI7Ij4yMDE4LTA5LTEyPC90ZXh0PjxsaW5lIHgxPSI1MCIgeTE9IjI5NSIgeDI9IjUwIiB5Mj0iMCIgc3R5bGU9InN0cm9rZS13aWR0aDogMzsgc3Ryb2tlOiAjZmZmOyI+PC9saW5lPjxsaW5lIHgxPSI1MCIgeTE9IjI5NSIgeDI9IjUwIiB5Mj0iMCIgc3R5bGU9InN0cm9rZS13aWR0aDogMTsgc3Ryb2tlOiAjMjIyOyI+PC9saW5lPjx0ZXh0IHg9IjUwIiB5PSItMTUiIGR5PSI0cHgiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBzdHlsZT0idGV4dC1hbmNob3I6IG1pZGRsZTsgZmlsbDogIzIyMjsiPjIwMTgtMDktMDQ8L3RleHQ+PGxpbmUgeDE9IjE1MCIgeTE9IjI5NSIgeDI9IjE1MCIgeTI9IjAiIHN0eWxlPSJzdHJva2Utd2lkdGg6IDM7IHN0cm9rZTogI2ZmZjsiPjwvbGluZT48bGluZSB4MT0iMTUwIiB5MT0iMjk1IiB4Mj0iMTUwIiB5Mj0iMCIgc3R5bGU9InN0cm9rZS13aWR0aDogMTsgc3Ryb2tlOiAjMjIyOyI+PC9saW5lPjx0ZXh0IHg9IjE1MCIgeT0iLTE1IiBkeT0iNHB4IiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgc3R5bGU9InRleHQtYW5jaG9yOiBtaWRkbGU7IGZpbGw6ICMyMjI7Ij4yMDE4LTA5LTA2PC90ZXh0PjxsaW5lIHgxPSIyNTAiIHkxPSIyOTUiIHgyPSIyNTAiIHkyPSIwIiBzdHlsZT0ic3Ryb2tlLXdpZHRoOiAzOyBzdHJva2U6ICNmZmY7Ij48L2xpbmU+PGxpbmUgeDE9IjI1MCIgeTE9IjI5NSIgeDI9IjI1MCIgeTI9IjAiIHN0eWxlPSJzdHJva2Utd2lkdGg6IDE7IHN0cm9rZTogIzIyMjsiPjwvbGluZT48dGV4dCB4PSIyNTAiIHk9Ii0xNSIgZHk9IjRweCIgZm9udC1zaXplPSIxMiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIHN0eWxlPSJ0ZXh0LWFuY2hvcjogbWlkZGxlOyBmaWxsOiAjMjIyOyI+MjAxOC0wOS0wODwvdGV4dD48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLDI5NSkiIGZpbGw9Im5vbmUiIGZvbnQtc2l6ZT0iMTAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj48cGF0aCBjbGFzcz0iZG9tYWluIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgZD0iTTAuNSw2VjAuNUg1NTAuNVY2IiBzdHlsZT0ic3Ryb2tlOiAjMjIyOyI+PC9wYXRoPjxnIGNsYXNzPSJ0aWNrIiBvcGFjaXR5PSIxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjUsMCkiPjxsaW5lIHN0cm9rZT0iY3VycmVudENvbG9yIiB5Mj0iNiIgc3R5bGU9InN0cm9rZTogIzIyMjsiPjwvbGluZT48dGV4dCBmaWxsPSJjdXJyZW50Q29sb3IiIHk9IjkiIGR5PSIwLjcxZW0iIHN0eWxlPSJmaWxsOiAjMjIyOyIgZm9udC1zaXplPSIxMnB4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+TW9uIDAzPC90ZXh0PjwvZz48ZyBjbGFzcz0idGljayIgb3BhY2l0eT0iMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTAuNSwwKSI+PGxpbmUgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHkyPSI2IiBzdHlsZT0ic3Ryb2tlOiAjMjIyOyI+PC9saW5lPjx0ZXh0IGZpbGw9ImN1cnJlbnRDb2xvciIgeT0iOSIgZHk9IjAuNzFlbSIgc3R5bGU9ImZpbGw6ICMyMjI7IiBmb250LXNpemU9IjEycHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5UdWUgMDQ8L3RleHQ+PC9nPjxnIGNsYXNzPSJ0aWNrIiBvcGFjaXR5PSIxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMDAuNSwwKSI+PGxpbmUgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHkyPSI2IiBzdHlsZT0ic3Ryb2tlOiAjMjIyOyI+PC9saW5lPjx0ZXh0IGZpbGw9ImN1cnJlbnRDb2xvciIgeT0iOSIgZHk9IjAuNzFlbSIgc3R5bGU9ImZpbGw6ICMyMjI7IiBmb250LXNpemU9IjEycHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5XZWQgMDU8L3RleHQ+PC9nPjxnIGNsYXNzPSJ0aWNrIiBvcGFjaXR5PSIxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTAuNSwwKSI+PGxpbmUgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHkyPSI2IiBzdHlsZT0ic3Ryb2tlOiAjMjIyOyI+PC9saW5lPjx0ZXh0IGZpbGw9ImN1cnJlbnRDb2xvciIgeT0iOSIgZHk9IjAuNzFlbSIgc3R5bGU9ImZpbGw6ICMyMjI7IiBmb250LXNpemU9IjEycHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5UaHUgMDY8L3RleHQ+PC9nPjxnIGNsYXNzPSJ0aWNrIiBvcGFjaXR5PSIxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMDAuNSwwKSI+PGxpbmUgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHkyPSI2IiBzdHlsZT0ic3Ryb2tlOiAjMjIyOyI+PC9saW5lPjx0ZXh0IGZpbGw9ImN1cnJlbnRDb2xvciIgeT0iOSIgZHk9IjAuNzFlbSIgc3R5bGU9ImZpbGw6ICMyMjI7IiBmb250LXNpemU9IjEycHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5GcmkgMDc8L3RleHQ+PC9nPjxnIGNsYXNzPSJ0aWNrIiBvcGFjaXR5PSIxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNTAuNSwwKSI+PGxpbmUgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHkyPSI2IiBzdHlsZT0ic3Ryb2tlOiAjMjIyOyI+PC9saW5lPjx0ZXh0IGZpbGw9ImN1cnJlbnRDb2xvciIgeT0iOSIgZHk9IjAuNzFlbSIgc3R5bGU9ImZpbGw6ICMyMjI7IiBmb250LXNpemU9IjEycHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5TYXQgMDg8L3RleHQ+PC9nPjxnIGNsYXNzPSJ0aWNrIiBvcGFjaXR5PSIxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMDAuNSwwKSI+PGxpbmUgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHkyPSI2IiBzdHlsZT0ic3Ryb2tlOiAjMjIyOyI+PC9saW5lPjx0ZXh0IGZpbGw9ImN1cnJlbnRDb2xvciIgeT0iOSIgZHk9IjAuNzFlbSIgc3R5bGU9ImZpbGw6ICMyMjI7IiBmb250LXNpemU9IjEycHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5TZXAgMDk8L3RleHQ+PC9nPjxnIGNsYXNzPSJ0aWNrIiBvcGFjaXR5PSIxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzNTAuNSwwKSI+PGxpbmUgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHkyPSI2IiBzdHlsZT0ic3Ryb2tlOiAjMjIyOyI+PC9saW5lPjx0ZXh0IGZpbGw9ImN1cnJlbnRDb2xvciIgeT0iOSIgZHk9IjAuNzFlbSIgc3R5bGU9ImZpbGw6ICMyMjI7IiBmb250LXNpemU9IjEycHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5Nb24gMTA8L3RleHQ+PC9nPjxnIGNsYXNzPSJ0aWNrIiBvcGFjaXR5PSIxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0MDAuNSwwKSI+PGxpbmUgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHkyPSI2IiBzdHlsZT0ic3Ryb2tlOiAjMjIyOyI+PC9saW5lPjx0ZXh0IGZpbGw9ImN1cnJlbnRDb2xvciIgeT0iOSIgZHk9IjAuNzFlbSIgc3R5bGU9ImZpbGw6ICMyMjI7IiBmb250LXNpemU9IjEycHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5UdWUgMTE8L3RleHQ+PC9nPjxnIGNsYXNzPSJ0aWNrIiBvcGFjaXR5PSIxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0NTAuNSwwKSI+PGxpbmUgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHkyPSI2IiBzdHlsZT0ic3Ryb2tlOiAjMjIyOyI+PC9saW5lPjx0ZXh0IGZpbGw9ImN1cnJlbnRDb2xvciIgeT0iOSIgZHk9IjAuNzFlbSIgc3R5bGU9ImZpbGw6ICMyMjI7IiBmb250LXNpemU9IjEycHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5XZWQgMTI8L3RleHQ+PC9nPjxnIGNsYXNzPSJ0aWNrIiBvcGFjaXR5PSIxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1MDAuNSwwKSI+PGxpbmUgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHkyPSI2IiBzdHlsZT0ic3Ryb2tlOiAjMjIyOyI+PC9saW5lPjx0ZXh0IGZpbGw9ImN1cnJlbnRDb2xvciIgeT0iOSIgZHk9IjAuNzFlbSIgc3R5bGU9ImZpbGw6ICMyMjI7IiBmb250LXNpemU9IjEycHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5UaHUgMTM8L3RleHQ+PC9nPjxnIGNsYXNzPSJ0aWNrIiBvcGFjaXR5PSIxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1NTAuNSwwKSI+PGxpbmUgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHkyPSI2IiBzdHlsZT0ic3Ryb2tlOiAjMjIyOyI+PC9saW5lPjx0ZXh0IGZpbGw9ImN1cnJlbnRDb2xvciIgeT0iOSIgZHk9IjAuNzFlbSIgc3R5bGU9ImZpbGw6ICMyMjI7IiBmb250LXNpemU9IjEycHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5GcmkgMTQ8L3RleHQ+PC9nPjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1NTAgLDApIiBmaWxsPSJub25lIiBmb250LXNpemU9IjEwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgdGV4dC1hbmNob3I9InN0YXJ0Ij48cGF0aCBjbGFzcz0iZG9tYWluIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgZD0iTTYsMjk1LjVIMC41VjAuNUg2IiBzdHlsZT0ic3Ryb2tlOiAjMjIyOyI+PC9wYXRoPjxnIGNsYXNzPSJ0aWNrIiBvcGFjaXR5PSIxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLDI5NS41KSI+PGxpbmUgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHgyPSI2IiBzdHlsZT0ic3Ryb2tlOiAjMjIyOyI+PC9saW5lPjx0ZXh0IGZpbGw9ImN1cnJlbnRDb2xvciIgeD0iOSIgZHk9IjAuMzJlbSIgc3R5bGU9ImZpbGw6ICMyMjI7IiBmb250LXNpemU9IjEycHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj4wPC90ZXh0PjwvZz48ZyBjbGFzcz0idGljayIgb3BhY2l0eT0iMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwyNTMuMzU3MTQyODU3MTQyODYpIj48bGluZSBzdHJva2U9ImN1cnJlbnRDb2xvciIgeDI9IjYiIHN0eWxlPSJzdHJva2U6ICMyMjI7Ij48L2xpbmU+PHRleHQgZmlsbD0iY3VycmVudENvbG9yIiB4PSI5IiBkeT0iMC4zMmVtIiBzdHlsZT0iZmlsbDogIzIyMjsiIGZvbnQtc2l6ZT0iMTJweCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPjE8L3RleHQ+PC9nPjxnIGNsYXNzPSJ0aWNrIiBvcGFjaXR5PSIxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLDIxMS4yMTQyODU3MTQyODU3MikiPjxsaW5lIHN0cm9rZT0iY3VycmVudENvbG9yIiB4Mj0iNiIgc3R5bGU9InN0cm9rZTogIzIyMjsiPjwvbGluZT48dGV4dCBmaWxsPSJjdXJyZW50Q29sb3IiIHg9IjkiIGR5PSIwLjMyZW0iIHN0eWxlPSJmaWxsOiAjMjIyOyIgZm9udC1zaXplPSIxMnB4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+MjwvdGV4dD48L2c+PGcgY2xhc3M9InRpY2siIG9wYWNpdHk9IjEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsMTY5LjA3MTQyODU3MTQyODU4KSI+PGxpbmUgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHgyPSI2IiBzdHlsZT0ic3Ryb2tlOiAjMjIyOyI+PC9saW5lPjx0ZXh0IGZpbGw9ImN1cnJlbnRDb2xvciIgeD0iOSIgZHk9IjAuMzJlbSIgc3R5bGU9ImZpbGw6ICMyMjI7IiBmb250LXNpemU9IjEycHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj4zPC90ZXh0PjwvZz48ZyBjbGFzcz0idGljayIgb3BhY2l0eT0iMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwxMjYuOTI4NTcxNDI4NTcxNDQpIj48bGluZSBzdHJva2U9ImN1cnJlbnRDb2xvciIgeDI9IjYiIHN0eWxlPSJzdHJva2U6ICMyMjI7Ij48L2xpbmU+PHRleHQgZmlsbD0iY3VycmVudENvbG9yIiB4PSI5IiBkeT0iMC4zMmVtIiBzdHlsZT0iZmlsbDogIzIyMjsiIGZvbnQtc2l6ZT0iMTJweCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPjQ8L3RleHQ+PC9nPjxnIGNsYXNzPSJ0aWNrIiBvcGFjaXR5PSIxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLDg0Ljc4NTcxNDI4NTcxNDI4KSI+PGxpbmUgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHgyPSI2IiBzdHlsZT0ic3Ryb2tlOiAjMjIyOyI+PC9saW5lPjx0ZXh0IGZpbGw9ImN1cnJlbnRDb2xvciIgeD0iOSIgZHk9IjAuMzJlbSIgc3R5bGU9ImZpbGw6ICMyMjI7IiBmb250LXNpemU9IjEycHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj41PC90ZXh0PjwvZz48ZyBjbGFzcz0idGljayIgb3BhY2l0eT0iMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCw0Mi42NDI4NTcxNDI4NTcxNykiPjxsaW5lIHN0cm9rZT0iY3VycmVudENvbG9yIiB4Mj0iNiIgc3R5bGU9InN0cm9rZTogIzIyMjsiPjwvbGluZT48dGV4dCBmaWxsPSJjdXJyZW50Q29sb3IiIHg9IjkiIGR5PSIwLjMyZW0iIHN0eWxlPSJmaWxsOiAjMjIyOyIgZm9udC1zaXplPSIxMnB4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+NjwvdGV4dD48L2c+PGcgY2xhc3M9InRpY2siIG9wYWNpdHk9IjEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsMC41KSI+PGxpbmUgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHgyPSI2IiBzdHlsZT0ic3Ryb2tlOiAjMjIyOyI+PC9saW5lPjx0ZXh0IGZpbGw9ImN1cnJlbnRDb2xvciIgeD0iOSIgZHk9IjAuMzJlbSIgc3R5bGU9ImZpbGw6ICMyMjI7IiBmb250LXNpemU9IjEycHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj43PC90ZXh0PjwvZz48L2c+PHRleHQgeD0iNSIgeT0iLTU1IiBkeT0iNHB4IiBmb250LXNpemU9IjEycHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBzdHlsZT0idGV4dC1hbmNob3I6IHN0YXJ0OyBmaWxsOiAjMjIyOyI+VGVzdGluZyBDRkQ8L3RleHQ+PHRleHQgeD0iNSIgeT0iMTIiIGR5PSI0cHgiIGZvbnQtc2l6ZT0iMTJweCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIHN0eWxlPSJ0ZXh0LWFuY2hvcjogc3RhcnQ7IGZpbGw6ICNiZWMwYzI7Ij5UbyBEbzwvdGV4dD48dGV4dCB4PSI1IiB5PSIyNCIgZHk9IjRweCIgZm9udC1zaXplPSIxMnB4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgc3R5bGU9InRleHQtYW5jaG9yOiBzdGFydDsgZmlsbDogIzgwODI4NTsiPkluIFByb2dyZXNzPC90ZXh0Pjx0ZXh0IHg9IjUiIHk9IjM2IiBkeT0iNHB4IiBmb250LXNpemU9IjEycHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBzdHlsZT0idGV4dC1hbmNob3I6IHN0YXJ0OyBmaWxsOiAjMjIyOyI+RG9uZTwvdGV4dD48dGV4dCB4PSI2MDAiIHk9Ii0zNSIgZHk9IjRweCIgZm9udC1zaXplPSIxMnB4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgc3R5bGU9InRleHQtYW5jaG9yOiBzdGFydDsgZmlsbDogIzIyMjsiPlN0b3J5IFBvaW50czwvdGV4dD48L2c+PC9zdmc+"/>

## Usage

Install in your Node project with 
```
npm i cumulative-flow
``` 
and use it inside your code via 
```
const cfd = require('cumulative-flow');
```
or, alternatively 
```
import cfd from 'cfd';
```

Create then new cfd objects via
```
let cfd = cfd(settings);
```
Where settings is the configuration object for the drawing.

## Settings

-   `settings` **[Object][6]** The configuration object for the diagram.
    All data for the diagram is provided with this object.
    In this configuration object, whenever a date is to be given, it can be an
    [ISO 8601 String][7]
    or a JavaScript [Date][8] object.
    A [Moment][9] object is also fine.
    -   `settings.title` **[String][10]?** The title for the diagram.
    -   `settings.svg` **[Object][6]** The DOM tree element, wich must be an svg tag.
        The diagram will be attached to this DOM tree element. Example:<pre><code>settings.svg= document.getElementById('cfd-diagram');
        </code></pre>'cfd-diagram' is the id of a svg tag.
    -   `settings.fromDate` **([String][10] \| [Date][11])?** The start date for the diagram. Example:<pre><code>settings.fromDate = '2018-09-01';</code></pre>
    -   `settings.toDate` **([String][10] \| [Date][11])?** The end date for the diagram. Example:<pre><code>settings.fromDate = '2018-09-05';</code></pre>
    -   `settings.predict` **([String][10] \| [Date][11])?** To draw an indication line for the completion of work.
        The predict argument determines at what date to start drawing the line. Example:<pre><code>settings.fromDate = '2018-09-01';</code></pre>
    -   `settings.markers` **[Array][12]&lt;{date: ([String][10] \| [Date][11]), label: [String][10]}>?** Highlight specific dates of inside of the diagram
        with a markers, where each marker is an object with a date for the marker
        and an optional label for the marker. Example:<pre><code>settings.markers = [
        { date: '2018-09-03', label: 'M1' },
        { date: '2018-09-10', label: 'M2' }];</code></pre>
    -   `settings.data` **{toDo: [Array][12]&lt;[String][10]>, progress: [Array][12]&lt;[String][10]>, done: [Array][12]&lt;[String][10]>, unit: [String][10], entries: [Array][12]&lt;[Object][6]>}** The data for the diagram. Example:<pre><code>settings.data = {
        toDo: ['new'],
        progress: ['test', 'dev'],
        done: ['done'],
        unit: 'points',
        entries: [
        { date: '2018-09-03', new: 0, dev: 0, test: 0, done: 0 },
        { date: '2018-09-04', new: 1, dev: 0, test: 0, done: 0 },
        { date: '2018-09-05', new: 1, dev: 1, test: 0, done: 0 },
        { date: '2018-09-06', new: 1, dev: 0, test: 1, done: 1 },
        { date: '2018-09-07', new: 2, dev: 1, test: 0, done: 2 },
        { date: '2018-09-08', new: 1, dev: 1, test: 2, done: 2 },
        { date: '2018-09-09', new: 0, dev: 0, test: 1, done: 5 },
        { date: '2018-09-10', new: 1, dev: 1, test: 0, done: 5 }
        ]
        }
        </code></pre>Each entry object must contain a date and the status counts for the
        toDo, progress and done status categories.
        The unit is the unit of measurement for the status counts.
        A value of <code>points</code> indicates story points.
        An omitted unit will lead to interpreting the status counts as issue counts.
        The status categories <code>toDo</code>, <code>progress</code> and <code>done</code>
        must contain the status values as strings that belong exactly to those categories.
        The rendering of the layers in the Cumulate Flow Diagram will follow the order
        of the status values provided inside of the status categories. All values of the
        <code>done</code> status category are always renderen at the bottom of the diagram,
        beginning from left to right. Then all <code>progress</code> status values, again leftto right.
        Finally all <code>new</code> status values, of course left to right.
        For the above example: The <code>done</code> status layer is at the bottom, followed by
        the <code>test</code> and <code>dev</code> layer
        and finally the new <code>layer</code> is getting rendered.

## draw

```
cfd.draw();
```
Draw the Cumulative Flow Diagram inside of the provided ```settings.svg``` DOM tree element.

### remove

```
cfd.remove();
```
Clear the diagram from the provided ```settings.svg``` DOM tree element

### image

```
let inlineImage = cfd.image();
```
Draw the Cumulative Flow Diagram inside of the provided ```settings.svg``` DOM tree element and return the result as a string which can be assigned to the src attribute of an HTML img tag.

Returns **[string][10]**

[1]: #cfd

[2]: #parameters

[3]: #draw

[4]: #remove

[5]: #image

[6]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[7]: https://en.wikipedia.org/wiki/ISO_8601

[8]: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Date

[9]: https://momentjs.com

[10]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[11]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date

[12]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array