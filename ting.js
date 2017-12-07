var course_color = "#CCFF9A",
    conflict_color = "#FABD4E",
    university = null,
    DataLoader = {
        universities: null,
        timingMap: null,
        reloadData: null,
        buildTimingMap: function () {
            DataLoader.timingMap = [];
            for (var a = ["mo", "tu", "we", "th", "fr", "sa"], b = 1; b < 3; b++)
                for (var c = 0; c < a.length; c++)
                    for (var d = 8, e = 0; 22 === d && 0 === e || d < 22;) {
                        var f = "term" + b.toString() + "_" + a[c] + "_" + d.toString() + e.toString();
                        DataLoader.timingMap.push(f), 30 === e ? (e = 0, d++) : e = 30
                    }
        },
        retrieveUniversities: function () {
            $.ajax({
                type: "GET",
                url: "static/data/universities.json",
                dataType: "json",
                success: function (a) {
                    $("#courses_div").html(""), $("#course_add_button").html("<b>Click to load university data</b>"), $("#course_add_button").attr("onclick", "DataLoader.setUniversity();"), $("#course_add_button").attr("disabled", !1), DataLoader.universities = a, TimeTabler.renderSchedule();
                    var b = $("<select></select>").attr("id", "university_selector");
                    b.append($("<option></option>").html("Select a university...").attr({
                        selected: "selected",
                        value: "bad"
                    }));
                    var c = [];
                    for (var d in a) c.push(d);
                    c.sort();
                    for (var e = 0; e < c.length; e++) b.append($("<option></option>").html(a[c[e]].name).attr("value", c[e]));
                    $("#courses_div").append(b), DataLoader.injectStateData()
                },
                error: function (a, b, c) {
                    alert("Failed to load supported university data. Please contact the admin.")
                }
            })
        },
        createStateLink: function () {
            $("#state_create_button").attr("disabled", !0), $("#state_create_button").html("Hold on...");
            for (var a = [], b = 0; b < BoxManager.activeSelectors.length; b++) {
                var c = BoxManager.activeSelectors[b];
                if ("disabled" === $("#advance_button_" + c).attr("disabled")) {
                    c = "_select_" + BoxManager.activeSelectors[b] + " option:selected";
                    var d = [];
                    d.push($("#dep" + c).attr("value")), d.push($("#course" + c).attr("value")), d.push($("#core" + c).attr("value")), d.push($("#tutorial" + c).attr("value")), d.push($("#lab" + c).attr("value")), a.push(d)
                }
            }
            var e = {
                selectors: a,
                school: university.id
            };
            $("#timetable_link").html("Saving..."), $.ajax({
                type: "POST",
                url: "/api/v1/schedule",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(e),
                success: function (a) {
                    var b = "https://ttg.fyi/#" + a.id;
                    $("#timetable_link").html($("<a></a>").html(b).attr("href", b)), $("#state_create_button").html("Create Link"), $("#state_create_button").attr("disabled", !1)
                },
                error: function (a, b, c) {
                    $("#timetable_link").html("Error (" + c + "). Try again in a few minutes, or contact the admin if the issue persists.")
                }
            })
        },
        injectStateData: function () {
            key = window.location.href.match(/#([a-zA-Z0-9]+)$/), key && $.ajax({
                type: "GET",
                url: "/api/v1/schedule/" + key[1],
                dataType: "json",
                success: function (a) {
                    BoxManager.reconstructStage1(a.data)
                },
                error: function (a, b, c) {
                    404 === a.status ? alert('No such schedule with key "' + key[1] + '"') : alert("Failed to load saved schedule (error: " + c + "). Please contact the system admin.")
                }
            })
        },
        getQueryParameters: function () {
            var a = {};
            window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (b, c, d) {
                a[c] = d
            });
            return a
        },
        setUniversity: function () {
            var a = null;
            return a = DataLoader.reloadData ? DataLoader.reloadData.school : $("#university_selector option:selected").attr("value"), "bad" === a ? void alert("Select a university before proceeding...") : (university = DataLoader.universities[a], university.id = a, $("#courses_div").html("Hold on, retrieving scheduling for " + university.name + "..."), $("#course_add_button").html("<b>Add another course</b>"), $("#course_add_button").attr("onclick", "BoxManager.addNewSelector(TimeTabler.masterList)"), $("#course_add_button").attr("disabled", !0), void $.ajax({
                type: "GET",
                url: "/api/v1/school/" + a,
                dataType: "json",
                success: function (a) {
                    var b = moment(a.last_update, moment.ISO_8601).format("MMM Do YYYY h:mm A ZZ");
                    $("#course_add_button").attr("disabled", !1), $("#courses_div").html("<b>University</b> : " + university.name + "<br/><b>Last updated:</b> " + b + "<br/>"), TimeTabler.masterCourseList = a.courses, TimeTabler.masterDepartmentList = a.departments, DataLoader.reloadData ? BoxManager.reconstructStage2(DataLoader.reloadData) : BoxManager.addNewSelector(TimeTabler.masterList), $("#save_state_div").css("display", "block")
                },
                error: function (a, b, c) {
                    alert("Failed to load school data. Please contact the admin.")
                }
            }))
        }
    },
    TimeTabler = {
        runningSchedule: {},
        masterCourseList: null,
        masterDepartmentList: null,
        sameCourse: function (a, b) {
            return !!(a.term === b.term || a.termThree && b.termThree) && (a.name === b.name && (a.code === b.code && a.dep === b.dep))
        },
        schoolUnitsEqual: function (a, b) {
            return a.targetType === b.targetType && TimeTabler.sameCourse(a, b)
        },
        splitTargets: function (a) {
            var b = jQuery.extend(!0, {}, a),
                c = jQuery.extend(!0, {}, a);
            b.target.times = [], c.target.times = [], b.term = 1, c.term = 2, b.termThree = !0, c.termThree = !0;
            for (var d = a.target.times, e = 0; e < d.length; e++) 1 !== d[e][0] && 3 !== d[e][0] || b.target.times.push(d[e]), 2 !== d[e][0] && 3 !== d[e][0] || c.target.times.push(d[e]);
            return {
                first: b,
                second: c
            }
        },
        importSchoolUnit: function (a) {
            if (3 === a.term) {
                var b = TimeTabler.splitTargets(a);
                return TimeTabler.importSchoolUnit(b.first), void TimeTabler.importSchoolUnit(b.second)
            }
            for (var c = "term" + a.term.toString(), d = a.target.times, e = 0; e < d.length; e++) {
                var f = d[e][1],
                    g = d[e][2],
                    h = d[e][3],
                    i = d[e][4],
                    j = d[e][5];
                for (a.target.loc = d[e][6], 30 !== h && 0 !== h && (h > 30 ? h - 30 > 15 ? (h = 0, g++) : h = 30 : h = 30 - h > 15 ? 0 : 30); g === i && h < j || g < i;) {
                    var k = c + "_" + f + "_" + g.toString() + h.toString(),
                        l = TimeTabler.runningSchedule[k];
                    l ? TimeTabler.runningSchedule[k].push(a) : TimeTabler.runningSchedule[k] = [a], 30 === h ? (h = 0, g++) : h = 30
                }
            }
        },
        removeSchoolUnit: function (a) {
            var b = a.target.times;
            for (var c in TimeTabler.colorWheel)
                if (TimeTabler.colorWheel[c] && TimeTabler.sameCourse(TimeTabler.colorWheel[c], a)) {
                    TimeTabler.colorWheel[c] = null;
                    break
                }
            if (3 === a.term) {
                var d = TimeTabler.splitTargets(a);
                return TimeTabler.removeSchoolUnit(d.first), void TimeTabler.removeSchoolUnit(d.second)
            }
            for (var e = "term" + a.term.toString(), f = 0; f < b.length; f++)
                for (var g = b[f][1], h = b[f][2], i = b[f][3], j = b[f][4], k = b[f][5]; h === j && i < k || h < j;) {
                    var l = e + "_" + g + "_" + h.toString() + i.toString(),
                        m = TimeTabler.runningSchedule[l];
                    if (m) {
                        var n = null;
                        for (var o in m)
                            if (TimeTabler.schoolUnitsEqual(m[o], a)) {
                                n = o;
                                break
                            }
                        TimeTabler.runningSchedule[l].splice(o, 1), 0 === TimeTabler.runningSchedule[l].length && delete TimeTabler.runningSchedule[l]
                    }
                    30 === i ? (i = 0, h++) : i = 30
                }
        },
        colorWheel: {
            "#DCF394": null,
            "#CCECF4": null,
            "#FFD7E3": null,
            "#F8FAA0": null,
            "#FAC892": null,
            "#A8A4FB": null,
            "#BBFDD7": null,
            "#A8D3A0": null,
            "#36FED1": null,
            "#68FE36": null,
            "#F7806F": null,
            "#E4C7FC": null,
            "#DAF7CC": null,
            "#8BF986": null,
            "#DFE19D": null
        },
        getColor: function (a) {
            var b = null,
                c = null;
            for (var d in TimeTabler.colorWheel)
                if (TimeTabler.colorWheel[d]) {
                    if (TimeTabler.sameCourse(TimeTabler.colorWheel[d], a)) {
                        c = d;
                        break
                    }
                } else b || (b = d);
            return c || (b ? (TimeTabler.colorWheel[b] = a, c = b) : c = course_color), "mono" === $("input[name=course_color_group]:checked").val() && (c = course_color), c
        },
        clearSchedule: function () {
            $("#term1_sa_header").length > 0 && ($("#term1_sa_header").remove(), $("#term1_details").attr("colspan", 6), $("#term1_title").attr("colspan", 6)), $("#term2_sa_header").length > 0 && ($("#term2_sa_header").remove(), $("#term2_details").attr("colspan", 6), $("#term2_title").attr("colspan", 6));
            for (var a = 0; a < DataLoader.timingMap.length; a++) {
                var b = DataLoader.timingMap[a],
                    c = /^term[123]_([a-z]{2,2})_[0-9]+$/.exec(b)[1];
                if ($("#" + b).length > 0 && $("#" + b).remove(), "sa" != c) {
                    var d = $("<td></td>").attr({
                        id: b,
                        "class": "daytime_slot"
                    });
                    $("#" + b.replace("_" + c + "_", "_")).append(d)
                }
            }
        },
        buildSaturday: function (a) {
            $("#term" + a.toString() + "_title").attr("colspan", 7), $("#term" + a.toString() + "_details").attr("colspan", 7);
            var b = $("<th>Saturday</th>").attr({
                id: "term" + a.toString() + "_sa_header",
                "class": "days"
            });
            $("#term" + a.toString() + "_days").append(b);
            for (var c = new RegExp("^term" + a + "_sa_"), d = 0; d < DataLoader.timingMap.length; d++) {
                var e = DataLoader.timingMap[d];
                if (c.exec(e)) {
                    var f = $("<td></td>").attr({
                        id: e,
                        "class": "daytime_slot"
                    });
                    $("#" + e.replace("_sa_", "_")).append(f)
                }
            }
        },
        renderSchedule: function () {
            var a = 0,
                b = 0,
                c = 0,
                d = null,
                e = null,
                f = [0, 0],
                g = [0, 0],
                h = [!1, !1],
                i = null,
                j = null,
                k = null,
                l = null,
                m = [];
            for (TimeTabler.clearSchedule(), a = 0; a < DataLoader.timingMap.length; a++) {
                var n = DataLoader.timingMap[a],
                    o = TimeTabler.runningSchedule[n];
                if (o && 0 !== o.length) {
                    var p = /^term([12])_([a-z]+)_/.exec(n),
                        q = parseInt(p[1]),
                        r = p[2];
                    for (f[q - 1] += .5, "sa" === r && (h[0] || 1 !== q ? h[1] || 2 !== q || (TimeTabler.buildSaturday(2), h[1] = !0) : (TimeTabler.buildSaturday(1), h[0] = !0)), b = 0; b < o.length; b++) {
                        var s = !0;
                        for (c = 0; c < m.length; c++)
                            if (TimeTabler.sameCourse(o[b], m[c])) {
                                s = !1;
                                break
                            }
                        if (s) {
                            m.push(o[b]);
                            var t = o[b].credits;
                            o[b].termThree ? (g[0] += t / 2, g[1] += t / 2) : g[q - 1] += t
                        }
                    }
                    if (1 === o.length) j = null, i = null, k && TimeTabler.schoolUnitsEqual(o[0], l) ? (k.attr("rowspan", parseInt(k.attr("rowspan")) + 1), $("#" + n).remove()) : (k = $("#" + n), l = o[0], e = TimeTabler.getColor(l), k.attr({
                        bgcolor: e,
                        rowspan: 1
                    }), k.css("background", e), d = "<font color='blue'>", "core" === l.targetType && l.target.supervisors.length > 0 && (d += "</br>" + l.target.supervisors[0]), d += "</font>", k.html(l.code + " " + university.school_unit_prefixes[l.targetType] + l.target.name + d + (l.target.serial ? "</br>" + l.target.serial : "") + (l.target.loc ? "</br>" + l.target.loc : "") + (l.target.alternating ? "</br><font color='red'>ALTERNATING</font>" : "")));
                    else {
                        k = null, l = null;
                        var u = !0;
                        if (i)
                            if (o.length === i.length)
                                for (b = 0; b < o.length; b++) {
                                    var v = !1;
                                    for (c = 0; c < i.length; c++)
                                        if (TimeTabler.schoolUnitsEqual(o[b], i[c])) {
                                            v = !0;
                                            break
                                        }
                                    if (!v) {
                                        u = !1;
                                        break
                                    }
                                } else u = !1;
                            else u = !1;
                        if (u) j.attr("rowspan", parseInt(j.attr("rowspan")) + 1), $("#" + n).remove();
                        else {
                            j = $("#" + n), i = o;
                            var w = !1;
                            for (b = 0; b < o.length; b++)
                                for (c = 0; c < o.length; c++) {
                                    if (!(b == c || o[b].target.alternating && o[c].target.alternating && TimeTabler.sameCourse(o[b], o[c]) && o[c].targetType !== o[b].targetType)) {
                                        w = !0;
                                        break
                                    }
                                    if (w) break
                                }
                            for (w ? ($("#" + n).attr("bgcolor", conflict_color), $("#" + n).css("background", conflict_color)) : (e = TimeTabler.getColor(o[0]), $("#" + n).attr("bgcolor", e), $("#" + n).css("background", e)), $("#" + n).attr("rowspan", 1), j.html(""), b = 0; b < o.length; b++) {
                                var x = o[b];
                                d = "<font color='blue'>", "core" === x.targetType && x.target.supervisors.length > 0 && (d += "</br>" + x.target.supervisors[0]), d += "</font>", j.append(x.code + " " + university.school_unit_prefixes[x.targetType] + x.target.name + d + (x.target.serial ? "</br>" + x.target.serial : "") + (x.target.loc ? "</br>" + x.target.loc : "") + "</br><font color='red'>" + (w ? "*** CONFLICT ***" : "ALTERNATING") + "</br>")
                            }
                        }
                    }
                } else i = null, j = null, k = null, l = null
            }
            $("#term1_details").html("TOTAL HOURS : " + f[0] + ", TOTAL UNITS : " + g[0]), $("#term2_details").html("TOTAL HOURS : " + f[1] + ", TOTAL UNITS : " + g[1])
        }
    },
    BoxManager = {
        activeSelectors: [],
        id_number: 0,
        data_path: {},
        reconstructStage1: function (a) {
            $("#courses_div").html(""), TimeTabler.runningSchedule = {}, BoxManager.id_number = 0, a.selectors && a.school && a.school in DataLoader.universities || (alert("Bad scheduling data. Contact the administrator to fix this."), window.location = window.location), $("input[name=course_color_group]").filter("[value=" + a.type + "]").attr("checked", !0);
            for (var b in TimeTabler.colorWheel) TimeTabler.colorWheel[b] = null;
            DataLoader.reloadData = a, DataLoader.setUniversity()
        },
        reconstructStage2: function (a) {
            for (var b = ["dep_select_", "course_select_", "core_select_", "tutorial_select_", "lab_select_"], c = 0; c < a.selectors.length; c++) {
                var d = a.selectors[c];
                BoxManager.addNewSelector(TimeTabler.masterCourseList);
                for (var e = 0; e < d.length; e++)
                    if (d[e] || !(e > 2)) {
                        if (!($("#" + b[e] + c + " option[value='" + d[e] + "']").length > 0)) {
                            alert("Cannot find an option with the value '" + d[e] + "' under this menu. Skipping");
                            break
                        }
                        $("#" + b[e] + c).val(d[e]), e < 2 && $("#advance_button_" + c).click()
                    }
                $("#advance_button_" + c).click()
            }
        },
        removeSelector: function (a) {
            var b = confirm("Are you sure you want to remove this set of selectors and all associated courses?");
            if (b) {
                var c = $("#advance_button_" + a).attr("onclick").indexOf("BoxManager.addCourse(") > -1;
                c && $("#reverse_button_" + a).click(), $("#select_set_" + a).remove();
                for (var d = BoxManager.activeSelectors.length; d >= 0; d--)
                    if (BoxManager.activeSelectors[d] === a) {
                        BoxManager.activeSelectors.splice(d, 1);
                        break
                    }
            }
        },
        addNewSelector: function () {
            var a = 0,
                b = BoxManager.id_number,
                c = $("#courses_div"),
                d = $("<div></div>").attr("id", "select_set_" + b),
                e = $("<select></select>").attr("id", "dep_select_" + b);
            e.append($("<option></option>").html("Select a department...").attr({
                selected: "selected",
                value: "bad"
            }));
            var f = [];
            for (a in TimeTabler.masterDepartmentList) f.push(a);
            for (f.sort(), a = 0; a < f.length; a++) e.append($("<option></option>").html(f[a]).attr("value", TimeTabler.masterDepartmentList[f[a]]));
            var g = $("<select></select>").attr({
                    disabled: !0,
                    id: "course_select_" + b
                }),
                h = $("<select></select>").attr({
                    disabled: !0,
                    id: "core_select_" + b
                }),
                i = $("<select></select>").attr({
                    disabled: !0,
                    id: "tutorial_select_" + b
                }),
                j = $("<select></select>").attr({
                    disabled: !0,
                    id: "lab_select_" + b
                }),
                k = $("<button></button>").html("Next").attr({
                    id: "advance_button_" + b,
                    onclick: "BoxManager.setCourse(" + b + ")"
                }),
                l = $("<button></button>").html("Undo").attr({
                    disabled: !0,
                    id: "reverse_button_" + b,
                    onclick: "BoxManager.setCourse(" + b + ")"
                }),
                m = $("<button></button>").html("Remove").attr({
                    id: "remove_button_" + b,
                    onclick: "BoxManager.removeSelector(" + b + ")"
                });
            d.append(e), d.append(g), d.append(h), d.append(i), d.append(j), d.append(k), d.append(l), d.append(m), c.append(d), BoxManager.data_path[b] = [], BoxManager.activeSelectors.push(b), BoxManager.id_number++
        },
        getData: function (a) {
            var b = TimeTabler.masterCourseList;
            for (var c in BoxManager.data_path[a]) b = b[BoxManager.data_path[a][c]];
            return b
        },
        returnFromCourse: function (a) {
            $("#dep_select_" + a).attr("disabled", !1), $("#course_select_" + a).attr("disabled", !0), $("#course_select_" + a).html(""), $("#advance_button_" + a).attr("onclick", "BoxManager.setCourse(" + a + ")"), $("#reverse_button_" + a).attr({
                onclick: "",
                disabled: !0
            }), BoxManager.data_path[a].pop()
        },
        setCourse: function (a) {
            var b = $("#dep_select_" + a + " option:selected").attr("value");
            if ("bad" === b) return void alert("Please select a department before proceeding...");
            BoxManager.data_path[a].push(b), $("#dep_select_" + a).attr("disabled", !0), $("#course_select_" + a).attr("disabled", !1);
            var c = BoxManager.getData(a),
                d = {},
                e = [];
            for (var f in c) {
                var g = c[f],
                    h = g.code + (g.name ? " " + g.name : "");
                h += university.show_term ? " T" + g.term : "", e.push(h), d[h] = f
            }
            e.sort(), $("#course_select_" + a).html(""), $("#course_select_" + a).append($("<option></option>").html("Select a course...").attr({
                selected: "selected",
                value: "bad"
            }));
            for (var i = 0; i < e.length; i++) $("#course_select_" + a).append($("<option></option>").html(e[i]).attr("value", d[e[i]]));
            $("#advance_button_" + a).attr("onclick", "BoxManager.setSchoolUnits(" + a + ")"), $("#reverse_button_" + a).attr({
                onclick: "BoxManager.returnFromCourse(" + a + ")",
                disabled: !1
            })
        },
        returnFromSchoolUnits: function (a) {
            $("#course_select_" + a).attr("disabled", !1), $("#core_select_" + a).attr("disabled", !0), $("#lab_select_" + a).attr("disabled", !0), $("#tutorial_select_" + a).attr("disabled", !0), $("#core_select_" + a).html(""), $("#lab_select_" + a).html(""), $("#tutorial_select_" + a).html(""), $("#advance_button_" + a).attr("onclick", "BoxManager.setSchoolUnits(" + a + ")"), $("#reverse_button_" + a).attr("onclick", "BoxManager.returnFromCourse(" + a + ")"), BoxManager.data_path[a].pop()
        },
        setSchoolUnits: function (a) {
            var b = $("#course_select_" + a + " option:selected").attr("value");
            if ("bad" === b) return void alert("Please select a course before proceeding...");
            BoxManager.data_path[a].push(b), $("#course_select_" + a).attr("disabled", !0);
            var c = BoxManager.getData(a);
            $("#su_select_" + a).append($("<option></option>").html("Select a section type...").attr({
                selected: "selected",
                value: "bad"
            }));
            for (var d in c)
                if ("core" === d || "lab" === d || "tutorial" === d) {
                    var e = (c[d], university.school_unit_prefixes[d]),
                        f = university.school_unit_names[d].toLowerCase();
                    $("#" + d + "_select_" + a).html(""), $("#" + d + "_select_" + a).attr("disabled", !1), $("#" + d + "_select_" + a).append($("<option></option>").html("Select a " + f + "...").attr({
                        selected: "selected",
                        value: "bad"
                    }));
                    var g = {},
                        h = [];
                    for (section in c[d]) {
                        var i = c[d][section].name;
                        h.push(i), g[i] = section
                    }
                    h.sort(function (a, b) {
                        return a - b
                    });
                    for (var j in h) $("#" + d + "_select_" + a).append($("<option></option>").html(e + h[j].toString()).attr("value", g[h[j]]))
                }
            $("#advance_button_" + a).attr("onclick", "BoxManager.addCourse(" + a + ")"), $("#reverse_button_" + a).attr("onclick", "BoxManager.returnFromSchoolUnits(" + a + ")")
        },
        addCourse: function (a) {
            var b = 0,
                c = $("#core_select_" + a + " option:selected").attr("value"),
                d = $("#lab_select_" + a + " option:selected").attr("value"),
                e = $("#tutorial_select_" + a + " option:selected").attr("value"),
                f = "undefined" != typeof c,
                g = "undefined" != typeof d,
                h = "undefined" != typeof e,
                i = [f, g, h],
                j = [c, d, e],
                k = ["core", "lab", "tutorial"];
            for (b = 0; b < 3; b++)
                if (i[b] && "bad" === j[b]) return void alert("Please select a " + university.school_unit_names[k[b]].toLowerCase() + " before proceeding...");
            var l = ["core", "lab", "tutorial"];
            for (b = 0; b < 3; b++)
                if (i[b]) {
                    BoxManager.data_path[a].push(l[b]), BoxManager.data_path[a].push(j[b]);
                    var m = BoxManager.createTarget(a);
                    TimeTabler.importSchoolUnit(m), BoxManager.data_path[a].pop(), BoxManager.data_path[a].pop()
                }
            TimeTabler.renderSchedule(), $("#core_select_" + a).attr("disabled", !0), $("#lab_select_" + a).attr("disabled", !0), $("#tutorial_select_" + a).attr("disabled", !0), $("#advance_button_" + a).attr("disabled", !0), $("#reverse_button_" + a).attr("disabled", !1), $("#reverse_button_" + a).attr("onclick", "BoxManager.removeCourse(" + a + ")")
        },
        removeCourse: function (a) {
            var b = 0,
                c = $("#core_select_" + a + " option:selected").attr("value"),
                d = $("#lab_select_" + a + " option:selected").attr("value"),
                e = $("#tutorial_select_" + a + " option:selected").attr("value"),
                f = "undefined" != typeof c,
                g = "undefined" != typeof d,
                h = "undefined" != typeof e,
                i = [{
                    enabled: f,
                    type: "core",
                    choice: c
                }, {
                    enabled: g,
                    type: "lab",
                    choice: d
                }, {
                    enabled: h,
                    type: "tutorial",
                    choice: e
                }];
            for (b = 0; b < i.length; b++)
                if (i[b].enabled) {
                    BoxManager.data_path[a].push(i[b].type), BoxManager.data_path[a].push(i[b].choice);
                    var j = BoxManager.createTarget(a);
                    TimeTabler.removeSchoolUnit(j), BoxManager.data_path[a].pop(), BoxManager.data_path[a].pop()
                }
            TimeTabler.renderSchedule(), $("#core_select_" + a).attr("disabled", !f), $("#lab_select_" + a).attr("disabled", !g), $("#tutorial_select_" + a).attr("disabled", !h), $("#advance_button_" + a).attr("disabled", !1), $("#reverse_button_" + a).attr("disabled", !1), $("#reverse_button_" + a).attr("onclick", "BoxManager.returnFromSchoolUnits(" + a + ")")
        },
        createTarget: function (a) {
            var b = BoxManager.data_path[a],
                c = (b[0], TimeTabler.masterCourseList[b[0]][b[1]]),
                d = jQuery.extend(!0, {}, c);
            return d.target = c[b[2]][b[3]], d.targetType = b[2].toLowerCase(), d.dep = b[0], d
        }
    };
