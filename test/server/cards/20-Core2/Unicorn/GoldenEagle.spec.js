describe('Golden Eagle', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer', 'warrior-of-the-open-hand'],
                    hand: ['golden-eagle']
                },
                player2: {
                    inPlay: ['underhanded-samurai']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.warrior = this.player1.findCardByName('warrior-of-the-open-hand');
            this.eagle = this.player1.findCardByName('golden-eagle');
            this.samurai = this.player2.findCardByName('underhanded-samurai');
        });

        it('as an attachment, makes each character controlled by an opponent lose covert', function() {
            expect(this.samurai.hasKeyword('covert')).toBe(true);
            this.player1.playAttachment(this.eagle, this.whisperer);

            expect(this.eagle.parent).toBe(this.whisperer);
            expect(this.getChatLogs(2)).toContain('player1 plays Golden Eagle, attaching it to Doji Whisperer');
            expect(this.samurai.hasKeyword('covert')).toBe(false);
            expect(this.warrior.hasKeyword('covert')).toBe(true);
        });

        it('as a character, does not remove covert', function() {
            this.player1.playCharacterFromHand(this.eagle);

            expect(this.eagle.location).toBe('play area');
            expect(this.samurai.hasKeyword('covert')).toBe(true);
            expect(this.warrior.hasKeyword('covert')).toBe(true);
        });
    });
});
