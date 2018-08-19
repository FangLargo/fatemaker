/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

//Sets up the display, field, and button.
var fateDisplay = $('#fateDisplay');
var optionField = $('#optionField');
var randomizeButton = $('#randomize');

$(document).ready(function () {
    $("#fateDisplay").text("0");
    adjustSize();
    
    $(window).on('resize', function () {
        adjustSize();
    });

});

var adjustSize = function () {
    if ($(window).height() > $(window).width()) {
        $("#fateDisplay").css({"font-size": (($(window).width() * 0.35).toString() + "px")});
    } else {
        $("#fateDisplay").css({"font-size": (($(window).height() * 0.35).toString() + "px")});
    };
};

var maxInterval = 1000;
var minInterval = 300;

var calculating = false;

var audio = document.createElement('audio');

var duration;
var progress = 0;

audio.addEventListener('loadedmetadata', function () {

    duration = audio.duration * 1000;

    setTimeout(function() {
        duration = audio.duration * 1000;
        updateFate();
    }, 2000);
    audio.volume = 0.5;
    audio.play();
    fateDisplay.text(Math.floor((Math.random() * optionField.val()) + 1));
    document.body.style.background = getRandomColor();
    
});

function updateFate() {
    progress = audio.currentTime * 1000;
    
    if(progress < duration) {
        var increment;
        
        if (progress < duration/2) {
            increment = maxInterval - Math.easeInOut(progress, 0, maxInterval, duration/2);
        } else {
            increment = maxInterval - Math.easeInOut(duration - progress, 0, maxInterval, duration/2);
        }
        
        if (increment <= minInterval) {
            increment = minInterval;
        }
        
        fateDisplay.text(Math.floor((Math.random() * optionField.val()) + 1));
        document.body.style.background = getRandomColor();
        
        setTimeout(function () {
            updateFate();
        }, increment * 0.8);
    } else {
        randomizeButton.text("Randomize!");
        $("#randomize").addClass("btn-primary");
        $("#randomize").removeClass("btn-danger");
        document.getElementById("optionField").removeAttribute("disabled");
        calculating = false;
        progress = 0;
    }
}

var decimal;

$("#randomize").click(function () {
    if($.isNumeric(optionField.val()) && calculating === false) {
        if(optionField.val() === Math.floor(optionField.val())) {
            decimal = false;
        } else {
            decimal = true;
        }

        audio.src = 'audio/' + fileList[Math.floor(Math.random()*fileList.length)];
        randomizeButton.text("Calculating...");
        $("#randomize").removeClass("btn-primary");
        $("#randomize").addClass("btn-danger");
        document.getElementById("optionField").setAttribute("disabled", "true");
        calculating = true;

    }

    
});

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

Math.easeInOut = function (t, b, c, d) {
    /*
     * t = Time
     * b = Start value
     * c = End value
     * d = Total time
     */
    t /= d / 2;
    if (t < 1)
        return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
    t--;
    return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
};
