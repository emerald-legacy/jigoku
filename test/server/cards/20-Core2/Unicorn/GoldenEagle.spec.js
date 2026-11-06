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

describe('Golden Eagle played as an attachment', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 10,
                    inPlay: ['doji-whisperer'],
                    hand: ['golden-eagle']
                },
                player2: {
                    inPlay: ['underhanded-samurai'],
                    hand: ['let-go']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.eagle = this.player1.findCardByName('golden-eagle');
            this.letGo = this.player2.findCardByName('let-go');

            this.player1.playAttachment(this.eagle, this.whisperer);
            expect(this.eagle.parent).toBe(this.whisperer);
        });

        it('should not have Courtesy', function () {
            expect(this.eagle.hasKeyword('courtesy')).toBe(false);
        });

        it('should give no fate when it is discarded', function () {
            const fate = this.player1.fate;
            this.player2.clickCard(this.letGo);
            this.player2.clickCard(this.eagle);
            expect(this.eagle.location).toBe('conflict discard pile');
            expect(this.player1.fate).toBe(fate);
            expect(this.getChatLogs(5)).not.toContain('player1 gains a fate due to Golden Eagle\'s Courtesy');
        });
    });
});

describe('Golden Eagle played as a character', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    hand: ['golden-eagle']
                },
                player2: {}
            });
            this.eagle = this.player1.findCardByName('golden-eagle');
            this.player1.playCharacterFromHand(this.eagle);
        });

        it('has Courtesy and gains 1 fate when it leaves play', function () {
            expect(this.eagle.location).toBe('play area');
            expect(this.eagle.hasKeyword('courtesy')).toBe(true);
            expect(this.player1.fate).toBe(4);
            this.flow.finishConflictPhase();
            this.player1.clickPrompt('Done');
            expect(this.eagle.location).toBe('conflict discard pile');
            expect(this.getChatLogs(5)).toContain('player1 gains a fate due to Golden Eagle\'s Courtesy');
            expect(this.player1.fate).toBe(5);
        });
    });
});
