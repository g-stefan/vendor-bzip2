// Created by Grigore Stefan <g_stefan@yahoo.com>
// Public domain (Unlicense) <http://unlicense.org>
// SPDX-FileCopyrightText: 2022 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: Unlicense

Fabricare.include("vendor.vendor");

if (!Shell.directoryExists("source")) {
	exitIf(Shell.system("7z x -aoa archive/" + Project.vendor + ".7z"));
	Shell.rename(Project.vendor, "source");
};

Shell.mkdirRecursivelyIfNotExists("output");
Shell.mkdirRecursivelyIfNotExists("output/bin");
Shell.mkdirRecursivelyIfNotExists("output/include");
Shell.mkdirRecursivelyIfNotExists("output/lib");
Shell.mkdirRecursivelyIfNotExists("temp");

Shell.mkdirRecursivelyIfNotExists("output/include");
Shell.copyFile("source/bzlib.h", "output/include/bzlib.h");

global.xyoCCExtra = function() {
	arguments.push(

	    "--inc=output/include",
	    "--use-lib-path=output/lib",
	    "--rc-inc=output/include",

	    "--inc=" + pathRepository + "/include",
	    "--use-lib-path=" + pathRepository + "/lib",
	    "--rc-inc=" + pathRepository + "/include"

	);
	return arguments;
};

var compileProject = {
	"project" : "libbz2",
	"includePath" : [
		"output/include",
		"source",
	],
	"cSource" : [
		"source/blocksort.c",
		"source/huffman.c",
		"source/crctable.c",
		"source/randtable.c",
		"source/compress.c",
		"source/decompress.c",
		"source/bzlib.c"
	],
	"linkerDefinitionsFile" : "source/libbz2.def"
};

Shell.filePutContents("temp/" + compileProject.project + ".compile.json", JSON.encodeWithIndentation(compileProject));
exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--lib", "--output-lib-path=output/lib", "--crt-static")));
exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--dll", "--output-bin-path=output/bin", "--output-lib-path=output/lib")));
Shell.copyFile("output/lib/libbz2.lib", "output/lib/bzip2.lib");

var compileProject = {
	"project" : "bzip2",
	"includePath" : [ "output/include", "source" ],
	"cSource" : [ "source/bzip2.c" ],
	"library" : [ "libbz2.static" ]
};

Shell.filePutContents("temp/" + compileProject.project + ".compile.json", JSON.encodeWithIndentation(compileProject));
exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--exe", "--output-bin-path=output/bin", "--crt-static")));

var compileProject = {
	"project" : "bzip2recover",
	"includePath" : [ "output/include", "source" ],
	"cSource" : [ "source/bzip2recover.c" ],
	"library" : [ "libbz2.static" ]
};

Shell.filePutContents("temp/" + compileProject.project + ".compile.json", JSON.encodeWithIndentation(compileProject));
exitIf(xyoCC.apply(null, xyoCCExtra("@temp/" + compileProject.project + ".compile.json", "--exe", "--output-bin-path=output/bin", "--crt-static")));
