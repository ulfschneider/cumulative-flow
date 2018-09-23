[![Build Status](https://travis-ci.com/ulfschneider/cumulative-flow.svg?branch=master)](https://travis-ci.com/ulfschneider/cumulative-flow) [![Coverage Status](https://coveralls.io/repos/github/ulfschneider/cumulative-flow/badge.svg?branch=master)](https://coveralls.io/github/ulfschneider/cumulative-flow?branch=master) [![npm version](https://badge.fury.io/js/cumulative-flow.svg)](https://badge.fury.io/js/cumulative-flow)

# Cumulative Flow Diagram

Draw SVG Cumulative Flow Diagrams and use the option to indicate the anticipated completion of work.

<img src="/cfd.png"/>

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

-   `settings` **[Object][6]** The configuration object for the diagram. Whenever a date is provided in this object, it can be an [ISO 8601 String][7] or a JavaScript [Date][8] object. A [Moment][9] object is also fine.
    -   `settings.title` **[String][10]?** The title for the diagram.
    -   `settings.svg` **[Object][6]** The DOM tree element, wich must be an svg tag. The diagram will be attached to this DOM tree element. Example:<pre><code>settings.svg= document.getElementById('cfd-diagram');
        </code></pre>'cfd-diagram' is the id of a svg tag.
    -   `settings.fromDate` **([String][10] \| [Date][11])?** The start date for the diagram. Example:<pre><code>settings.fromDate = '2018-09-01';</code></pre>
    -   `settings.toDate` **([String][10] \| [Date][11])?** The end date for the diagram. Example:<pre><code>settings.fromDate = '2018-09-05';</code></pre>
    -   `settings.predict` **([String][10] \| [Date][11])?** To draw an indication line for the completion of work. The predict argument determines at what date to start drawing the line. Example:<pre><code>settings.fromDate = '2018-09-01';</code></pre>
    -   `settings.markers` **[Array][12]&lt;{date: ([String][10] \| [Date][11]), label: [String][10]}>?** Highlight specific dates of inside of the diagram with a markers, where each marker is an object with a date for the marker and an optional label for the marker. Example:<pre><code>settings.markers = [
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
        </code></pre>  
Each entry object must contain a date and the status counts for the `toDo`, `progress` and `done` status categories. The unit is the unit of measurement for the status counts. A value of `points` indicates story points. An omitted unit will lead to interpreting the status counts as issue counts. The status categories `toDo`, `progress` and `done` must contain the status values as strings that belong exactly to those categories. The rendering of the layers in the Cumulate Flow Diagram will follow the order of the status values provided inside of the status categories. All values of the `done` status category are always rendered at the bottom of the diagram,       beginning from left to right. Then all `progress` status values, again leftto right. Finally all `new` status values, of course left to right. For the above example: The `done` status layer is at the bottom, followed by the `test` and `dev` layer and finally the `new` layer is getting rendered.

## draw

```
cfd.draw();
```
Draw the Cumulative Flow Diagram inside of the provided `settings.svg` DOM tree element.

## remove

```
cfd.remove();
```
Clear the diagram from the provided `settings.svg` DOM tree element

## image

```
let inlineImage = cfd.image();
```
Draw the Cumulative Flow Diagram inside of the provided `settings.svg` DOM tree element and return the result as a string which can be assigned to the src attribute of an HTML img tag.

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