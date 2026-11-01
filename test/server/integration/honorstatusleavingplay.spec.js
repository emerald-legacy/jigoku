describe('personal honor when a character leaves play', function () {
    integration(function () {
        describe('when an effect only stops status tokens modifying skills', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 10,
                        inPlay: ['ikoma-message-runner', 'utaku-kamoko'],
                        hand: ['the-lion-s-shadow']
                    }
                });

                this.messageRunner = this.player1.findCardByName('ikoma-message-runner');
                this.kamoko = this.player1.findCardByName('utaku-kamoko');
                this.lionsShadow = this.player1.findCardByName('the-lion-s-shadow');
            });

            it('still loses honor when a dishonored character with The Lion\'s Shadow leaves play', function () {
                this.messageRunner.dishonor();
                this.player1.clickCard(this.lionsShadow);
                this.player1.clickCard(this.messageRunner);
                expect(this.messageRunner.attachments).toContain(this.lionsShadow);

                this.flow.finishConflictPhase();
                const honor = this.player1.honor;
                this.player1.clickCard(this.messageRunner);
                expect(this.messageRunner.location).toBe('dynasty discard pile');
                expect(this.player1.honor).toBe(honor - 1);
            });

            it('still loses honor when a dishonored Utaku Kamoko leaves play', function () {
                this.kamoko.dishonor();
                this.flow.finishConflictPhase();
                const honor = this.player1.honor;
                this.player1.clickCard(this.kamoko);
                expect(this.kamoko.location).toBe('dynasty discard pile');
                expect(this.player1.honor).toBe(honor - 1);
            });
        });
    });
});
