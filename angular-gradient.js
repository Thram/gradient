'use strict';
angular.module('angular-gradient', []).factory('Gradient', [
    function () {
        var gradients = null;
        var minNum = 0;
        var maxNum = 100;
        var colors = ['ff0000', 'ffff00', '00ff00', '0000ff'];
        setColors(colors)

        function ColourGradient() {
            var startColour = 'ff0000';
            var endColour = '0000ff';
            var minNum = 0;
            var maxNum = 100;

            function setGradient(colorStart, colorEnd) {
                startColour = getHexColour(colorStart);
                endColour = getHexColour(colorEnd);
            }

            function setNumberRange(minNumber, maxNumber) {
                if (maxNumber > minNumber) {
                    minNum = minNumber;
                    maxNum = maxNumber;
                } else {
                    throw new RangeError('maxNumber (' + maxNumber + ') is not greater than minNumber (' + minNumber + ')');
                }
            }

            function colorAt(number) {
                return calcHex(number, startColour.substring(0, 2), endColour.substring(0, 2))
                    + calcHex(number, startColour.substring(2, 4), endColour.substring(2, 4))
                    + calcHex(number, startColour.substring(4, 6), endColour.substring(4, 6));
            }

            function calcHex(number, channelStart_Base16, channelEnd_Base16) {
                var num = number;
                if (num < minNum) {
                    num = minNum;
                }
                if (num > maxNum) {
                    num = maxNum;
                }
                var numRange = maxNum - minNum;
                var cStart_Base10 = parseInt(channelStart_Base16, 16);
                var cEnd_Base10 = parseInt(channelEnd_Base16, 16);
                var cPerUnit = (cEnd_Base10 - cStart_Base10) / numRange;
                var c_Base10 = Math.round(cPerUnit * (num - minNum) + cStart_Base10);
                return formatHex(c_Base10.toString(16));
            }

            function formatHex(hex) {
                if (hex.length === 1) {
                    return '0' + hex;
                } else {
                    return hex;
                }
            }

            function isHexColour(string) {
                var regex = /^#?[0-9a-fA-F]{6}$/i;
                return regex.test(string);
            }

            function getHexColour(string) {
                if (isHexColour(string)) {
                    return string.substring(string.length - 6, string.length);
                } else {
                    var colorNames =
                        [
                            ['red', 'ff0000'],
                            ['lime', '00ff00'],
                            ['blue', '0000ff'],
                            ['yellow', 'ffff00'],
                            ['orange', 'ff8000'],
                            ['aqua', '00ffff'],
                            ['fuchsia', 'ff00ff'],
                            ['white', 'ffffff'],
                            ['black', '000000'],
                            ['gray', '808080'],
                            ['grey', '808080'],
                            ['silver', 'c0c0c0'],
                            ['maroon', '800000'],
                            ['olive', '808000'],
                            ['green', '008000'],
                            ['teal', '008080'],
                            ['navy', '000080'],
                            ['purple', '800080']
                        ];
                    for (var i = 0; i < colorNames.length; i++) {
                        if (string.toLowerCase() === colorNames[i][0]) {
                            return colorNames[i][1];
                        }
                    }
                    throw new Error(string + ' is not a valid color.');
                }
            }

            return {
                setGradient: setGradient,
                setNumberRange: setNumberRange,
                colorAt: colorAt
            }
        }

        function setColors(spectrum) {
            if (spectrum.length < 2) {
                throw new Error('Rainbow must have two or more colors.');
            } else {
                var increment = (maxNum - minNum) / (spectrum.length - 1);
                var firstGradient = new ColourGradient();
                firstGradient.setGradient(spectrum[0], spectrum[1]);
                firstGradient.setNumberRange(minNum, minNum + increment);
                gradients = [ firstGradient ];

                for (var i = 1; i < spectrum.length - 1; i++) {
                    var colorGradient = new ColourGradient();
                    colorGradient.setGradient(spectrum[i], spectrum[i + 1]);
                    colorGradient.setNumberRange(minNum + increment * i, minNum + increment * (i + 1));
                    gradients[i] = colorGradient;
                }

                colors = spectrum;
                return this;
            }
        }

        function setSpectrum() {
            setColors(arguments);
            return this;
        }

        function setSpectrumByArray(array) {
            setColors(array);
            return this;
        }

        function colorAt(number) {
            if (isNaN(number)) {
                throw new TypeError(number + ' is not a number');
            } else if (gradients.length === 1) {
                return gradients[0].colorAt(number);
            } else {
                var segment = (maxNum - minNum) / (gradients.length);
                var index = Math.min(Math.floor((Math.max(number, minNum) - minNum) / segment), gradients.length - 1);
                return gradients[index].colorAt(number);
            }
        }


        function setNumberRange(minNumber, maxNumber) {
            if (maxNumber > minNumber) {
                minNum = minNumber;
                maxNum = maxNumber;
                setColors(colors);
            } else {
                throw new RangeError('maxNumber (' + maxNumber + ') is not greater than minNumber (' + minNumber + ')');
            }
            return this;
        }

        return{
            setColors: setColors,
            colorAt: colorAt,
            setNumberRange: setNumberRange,
            setSpectrum: setSpectrum,
            setSpectrumByArray: setSpectrumByArray
        }
    }
]);
