[![Build Status](https://travis-ci.com/ulfschneider/cumulative-flow.svg?branch=master)](https://travis-ci.com/ulfschneider/cumulative-flow) [![Coverage Status](https://coveralls.io/repos/github/ulfschneider/cumulative-flow/badge.svg?branch=master)](https://coveralls.io/github/ulfschneider/cumulative-flow?branch=master) [![npm version](https://badge.fury.io/js/cumulative-flow.svg)](https://badge.fury.io/js/cumulative-flow)

# Cumulative Flow Diagram

Draw SVG Cumulative Flow Diagrams and use the option to indicate the anticipated completion of work.

<img src="https://raw.githubusercontent.com/ulfschneider/cumulative-flow/master/cfd.png"/>

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
import cfd from 'cumulative-flow';
```

Create the new cfd objects via
```
let diagram = cfd(settings);
```
Where settings is the configuration object for the drawing.

-   `settings` **[Object][6]** The configuration object for the diagram.
    All data for the diagram is provided with this object.
    In this configuration object, whenever a date is to be given,
    it can be an [ISO 8601 String][7]
    or a JavaScript [Date][8] object.
    A [Moment][9] object is also fine.
    -   `settings.title` **[String][10]?** The title for the diagram.
    -   `settings.svg` **[Object][6]** The DOM tree element, wich must be an svg tag.
        The diagram will be attached to this DOM tree element. Example:<pre>settings.svg = document.getElementById('cfd-diagram');</pre><code>'cfd-diagram'</code> is the id of a svg tag.
    -   `settings.margin` **{top: [Number][11], right: [Number][11], bottom: [Number][11], right: [Number][11]}?** The margins for the diagram. Default values are:<pre>settings.margins = {
        top: 75,
        right: 210,
        bottom: 30,
        left:  40}
        </pre>
    -   `settings.fromDate` **([String][10] \| [Date][12])?** The start date for the diagram. Example:<pre>settings.fromDate = '2018-09-01';</pre>
    -   `settings.toDate` **([String][10] \| [Date][12])?** The end date for the diagram. Example:<pre>settings.fromDate = '2018-09-05';</pre>
    -   `settings.predict` **([String][10] \| [Date][12])?** To draw an indication line for the completion of work.
        The predict argument determines at what date to start drawing the line. Example:<pre>settings.fromDate = '2018-09-01';</pre>
    -   `settings.markers` **[Array][13]&lt;{date: ([String][10] \| [Date][12]), label: [String][10]}>?** Highlight specific dates of inside of the diagram
        with markers. Each marker is an object with a date for the marker and an optional label. Example:<pre>settings.markers = [
        { date: '2018-09-03', label: 'M1' },
        { date: '2018-09-10', label: 'M2' }];</pre>
    -   `settings.drawOptions` **[Array][13]&lt;[String][10]>?** An array to determine the parts to be drawn. Possible contents:<pre>'title' - draw the title
        'axis' - draw the x and y axis
        'legend' - draw the legend information
        'markers' - draw the markers
        'predict' - draw the predict line
        'focus' - draw detailed data when hovering the diagram
        </pre> By default all of these draw options are on.
    -   `settings.style` **[Object][6]?** Influence the appearance of the diagram with font and color. The defaults are:<pre>settings.style = {
        fontSize: 12,
        fontFamily: 'sans-serif',
        color: '#222',
        backgroundColor: '#fff',
        axis: {color: '#222'},
        toDo: {color: '#ccc', stroke: '#fff'},
        progress: {color: '#888', stroke: '#fff'},
        done: {color: '#222', stroke: '#fff'},
        markers: {color: '#222', backgroundColor: '#fff'},
        predict: {color: '#222', backgroundColor: '#fff'}
        }</pre>
    -   `settings.data` **{toDo: [Array][13]&lt;[String][10]>, progress: [Array][13]&lt;[String][10]>, done: [Array][13]&lt;[String][10]>, unit: [String][10], entries: [Array][13]&lt;[Object][6]>}** The data for the diagram. Example:<pre>settings.data = {
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
        ]}</pre>Each entry object must contain a date and the status counts for th
        <code>toDo</code>, <code>progress</code> and <code>done</code> status categories.
        The unit is the unit of measurement for the status counts.
        A value of <code>points</code> indicates story points.
        An omitted unit will lead to interpreting the status counts as issue counts.
        The status categories <code>toDo</code>, <code>progress</code> and <code>done</code>
        must contain the status values as strings that belong exactly to those categories.
        The rendering of the layers in the Cumulate Flow Diagram will follow the order
        of the status values provided inside of the status categories. All values of the
        <code>done</code> status category are always rendered at the bottom of the diagram,
        beginning from left to right. Then all <code>progress</code> status values, again left to right.
        Finally all <code>new</code> status values, of course left to right.
        For the above example: The <code>done</code> status layer is at the bottom, followed by
        the <code>test</code> and <code>dev</code> layer
        and finally the <code>new</code> layer is getting rendered.

## draw
```diagram.draw();```
Draw the Cumulative Flow Diagram inside of the provided <code>settings.svg</code> DOM tree element.

## remove
```diagram.remove();```
Clear the diagram from the provided <code>settings.svg</code> DOM tree element

## image
```let inlineImage = diagram.image();```
Draw the Cumulative Flow Diagram inside of the provided <code>settings.svg</code> DOM tree element
and return the result as a string which can be assigned to the src attribute of an HTML img tag.

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

[11]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[12]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date

[13]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array