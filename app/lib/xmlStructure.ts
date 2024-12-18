export const xmlStructure = `
<response>
    <exact>
    <!-- exact input of the user word for word but with following addons:
    gramatical errors within <grammer> !-- part of the essay that contains grammer errors --> </grammer>
    spelling errors within <spelling> !-- part of the essay that contains spelling errors --> </spelling>-->
    </exact>
    <grading>
    <taskResponse> <!-- feedback on task response --> </taskResponse>
    <coherence> <!-- feedback on coherence --> </coherence>
    <lexicalResource> <!-- feedback on lexical resource --> </lexicalResource>
    <grammerAndAccuracy> <!-- feedback on grammer and accuracy --> </grammerAndAccuracy>
    <BAND> <!-- Band the essay achieved with the essay --> </BAND>
    </grading>

    <better>
    <!-- use the input essay of the student as a base and return a better version of it (the better version should achieve a band 8.5 or 9) -->
    </better>

    <feedback>
    <!-- Detailed feedback that explains areas student needs to focus on -->
    <!-- feedback on what to change to increase by a band or 2 include reffrences from the essay -->
    </feedback>
</response>
`;
