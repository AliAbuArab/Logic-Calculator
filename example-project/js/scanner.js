/******************************************************************************
 * File: scanner.js
 * Author: Keith Schwarz (htiek@cs.stanford.edu)
 *
 * A scanner to convert expressions from text into a propositional logic token
 * stream and associated variable <-> index map.
 *
 * The tokens can be any of these operators:
 *
 *    /\   \/  ->  <->  ~
 *
 * They can also be the special symbols T and F, parentheses, variables, or a
 * special EOF marker.
 */

kScannerConstants = {
	EOF: "$"						// EOF marker placed internally in the string
}
 
/* Function: scan(input)
 *
 * Scans the input string and produces an object with two fields:
 *
 *   tokens:    A list of the tokens in the input, in order.
 *   variables: A list of the variables keyed by their index. See below.
 *
 * For simplicity, each variable is replaced by a numeric code based on its
 * alphabetical index. For example, if the variables are p, q, and r, then
 * p would get value 0, q would get value 1, and r would get value 2. The
 * "variables" array would then be ["p", "q", "r"].
 *
 * The final token in the stream will be the token EOF, which the parser can then
 * use as needed.
 *
 * If a lexical error occurs, an error object is thrown. The error will contain
 * this information:
 *
 *   description: A human-readable description of the error.
 *   start:       The index into the string at which the error starts (inclusive).
 *   end:         The index into the string at which the error ends (exclusive).
 */
function scan(input) {
  /* Check that the input does not contain any invalid characters. */
  var okayChars = /[A-Za-z_0-9\\\/<>\-~()\s\&\|\=\!\u2227\u2228\u2192\u2194\u22A4\u22A5\u00AC]/;
	for (var i = 0; i < input.length; i++) {
		if (!okayChars.test(input.charAt(i))) {
			scannerFail("Illegal character", i, i + 1);
		}
	}
  
  /* Get a preliminary scan in which variables are named rather than
   * numbered.
   */
	/* Append a special $ marker to the end of the input. This will serve as our
   * EOF marker and eliminates a lot of special cases in input handling.
   */
	input += kScannerConstants.EOF;
  
  	/* Run the scan! */
  	var i = 0;            // Index into the string
	var variableSet = {}; // Set of variables in use
	var tokens = [];      // List of tokens
  
	while (true) {
		var curr = input.charAt(i); // Current character
		
		/* Stop on EOF if we find it. */
		if (curr === kScannerConstants.EOF) {
			tokens.push(makeIdentityToken(curr, i));
			preliminary = {
				"tokens": tokens,
				"variableSet" : variableSet
			};
			break;
		}
		/* If we're reading a variable, pull the whole variable. */
		else if (isVariableStart(input, i)) {
			/* We're going to do variables in a two-step process. First, we're going to
			* read the variables and store them by name. Afterwards, we'll postprocess
			* them to replace each variable name with its index.
			*/
			var variable = tryReadVariableName(input, i);
			/* variableName should not be null here, by contract. */
			variableSet[variable] = true;
			tokens.push(makeVariableToken(variable, i, i + variable.length));
			
			/* Skip past the token characters. */
			i += variable.length;
		}
		/* If we're reading an operator or other piece of syntax, pull the whole operator. */
		else if (isOperatorStart(input, i)) {
			var token = tryReadOperator(input, i);
			/* token should not be null here. */
			
			tokens.push(makeIdentityToken(token, i));
			
			/* Skip the characters we just read. */
			i += token.length;
		}
		/* If we're reading whitespace, just skip it. */
		else if (/\s/.test((input.charAt(i)))) {
			i++;
		}
		else {
			scannerFail("The character " + input.charAt(i) + " shouldn't be here.", i, i + 1);
		}
  	}
  
  	/* Convert the preliminary scan into the result by sorting variables by
   	* name and renumbering them.
   	*/
  	/* Add all the variables from the dictionary to an array so we can sort. */
	var variables = [];
	for (var key in preliminary.variableSet) {
		variables.push(key);
	}
	
	/* Sort the variables alphabetically. */
	variables.sort();
	
	/* Invert the array into the variable set for quick lookups. */
	for (var i = 0; i < variables.length; i++) {
		preliminary.variableSet[variables[i]] = i;
	}
	
	/* Change each variable's name to its index. */
	for (var j = 0; j < preliminary.tokens.length; j++) {
		if (preliminary.tokens[j].type === "variable") {
			preliminary.tokens[j].index = preliminary.variableSet[preliminary.tokens[j].index];
		}
	}

	return {
		tokens: preliminary.tokens,
		"variables": variables
	};
}

/* Function: makeIdentityToken
 *
 * Given a string that is its own token type, wraps that string up as a token for
 * the scanner.
 */
function makeIdentityToken(str, index) {
	return { type:  translate(str),
	         start: index,
	         end:   index + str.length };
}

/* Function: makeVariableToken
 *
 * Given a variable index, creates a token holding that variable index.
 */
function makeVariableToken(varIndex, start, end) {
	return { type: "variable", 
	         index: varIndex,
	         "start": start,
	         "end": end };
}

/* Function: isVariableStart
 *
 * Given the input to scan and an offset into that input, determines whether the
 * input beginning at that input is the name of a variable.
 *
 * Variable names must start with a letter or underscore, consist of letters and
 * underscores, and not be identically T or F.
 */
function isVariableStart(input, index) {
	return tryReadVariableName(input, index) !== null;
}

/* Function: tryReadVariableName
 *
 * Tries to read the name of a variable starting at the given index in the string.
 * If a variable name can be read, it is returned. If not, this function returns
 * null.
 */
function tryReadVariableName(input, index) {	
	/* Need to start with a letter or underscore. */
	if (!/[A-Za-z_]/.test(input.charAt(index))) return null;

	/* Keep reading characters while it's possible to do so. */	
	var result = "";
	while (/[A-Za-z_0-9]/.test(input.charAt(index))) {
		result += input.charAt(index);
		index++;	
	}
	
	/* Return the result as long as it isn't a reserved word. */
	if (result === "T" 
		|| result === "F" 
		|| result === "and" 
		|| result === "or" 
		|| result === "not" 
		|| result === "iff" 
		|| result === "implies" 
		|| result === "true" 
		|| result === "false"
	) return null;
	return result;
}

/* Function: isOperatorStart
 *
 * Given the input to scan and a start index, returns whether there's an operator
 * at the current position.
 */
function isOperatorStart(input, index) {
	return tryReadOperator(input, index) !== null;
}

/* Function: tryReadOperator
 *
 * Given the input to scan and a start index, returns the operator at the current
 * index if one exists, and null otherwise.
 */
function tryReadOperator(input, index) {
	/* Case 1: Single-char operator like (, ), ~, T, F. */
	if (/[()~TF!\u2227\u2228\u2192\u2194\u22A4\u22A5\u00AC]/.test(input.charAt(index))) {
		return input.charAt(index);
	}
	
	/* Case 2: Two-char operator like ->, /\, \/ */
	if (index === input.length - 1) return null;
	
	var twoChars = input.substring(index, index + 2);
	if (twoChars === "/\\" || twoChars === "\\/" || twoChars === "->" ||
	    twoChars === "&&"  || twoChars === "||"  || twoChars === "or" ||
	    twoChars === "=>") {
		return twoChars;
	}
	
	/* Case 3: Three-char operators like <-> */
	if (index === input.length - 2) return null;
	
	var threeChars = input.substring(index, index + 3);
	if (threeChars === "<->" || threeChars === "and" ||
	    threeChars === "<=>" || threeChars === "not" ||
	    threeChars === "iff") {
		return threeChars;
	}
	
	/* Case 4: Four-character operators like "true" */
	if (index === input.length - 3) return null;
	var fourChars = input.substring(index, index + 4);
	if (fourChars === "true") {
		return fourChars;
	}
	
	/* Case 4: Five-character operators like "false" */
	if (index === input.length - 4) return null;
	var fiveChars = input.substring(index, index + 5);
	if (fiveChars === "false") {
		return fiveChars;
	}
	
	/* Case 5: Seven-character operators like "implies" */
	if (index === input.length - 6) return null;
	
	var sevenChars = input.substring(index, index + 7);
	if (sevenChars === "implies") {
		return sevenChars;
	}
	
	/* If we got here, nothing matched. */
	return null;
}

/* Function: translate
 *
 * Translates a lexeme into its appropriate token type. This is used, for example, to map
 * & and | to /\ and \/.
 */
function translate(input) {
	if (input === "&&"  || input === "and" || input === "\u2227") return "/\\";
	if (input === "||"  || input === "or"  || input === "\u2228") return "\\/";
	if (input === "=>"  || input === "\u2192" || input === "implies") return "->";
	if (input === "<=>" || input === "\u2194" || input === "iff") return "<->";
	if (input === "not" || input === "!" || input === "\u00AC") return "~";
	if (input === "\u22A4" || input === "true") return "T";
	if (input === "\u22A5" || input === "false") return "F";
	return input;
}

/* Function: scannerFail
 *
 * Triggers a failure of the scanner on the specified range of characters.
 */
function scannerFail(why, start, end) {
	throw { "description": why,
	        "start":  start,
	        "end":    end };
}