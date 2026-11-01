describe('Centipede Tattoo', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['disciple-of-shinsei'],
                    hand: ['centipede-tattoo']
                }
            });

            this.disciple = this.player1.findCardByName('disciple-of-shinsei');
            this.tattoo = this.player1.findCardByName('centipede-tattoo');
        });

        it('gives the Tattooed trait', function () {
            expect(this.disciple.hasTrait('tattooed')).toBe(false);
            this.player1.playAttachment(this.tattoo, this.disciple);
            expect(this.disciple.hasTrait('tattooed')).toBe(true);
        });
    });
});

describe('Centipede Tattoo in a conflict', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [{ card: 'disciple-of-shinsei', attachments: ['centipede-tattoo'] }, 'togashi-initiate']
                },
                player2: {
                    inPlay: ['matsu-berserker', 'kitsuki-shomon', 'doji-whisperer']
                }
            });

            this.disciple = this.player1.findCardByName('disciple-of-shinsei');
            this.initiate = this.player1.findCardByName('togashi-initiate');
            this.berserker = this.player2.findCardByName('matsu-berserker');
            this.shomon = this.player2.findCardByName('kitsuki-shomon');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
        });

        it('does not bow the attached character in a conflict it lost', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.disciple, this.initiate],
                defenders: [this.berserker, this.shomon]
            });
            this.noMoreActions();

            expect(this.getChatLogs(5)).toContain('player2 won a military conflict 6 vs 3');
            expect(this.disciple.bowed).toBe(false);
            expect(this.initiate.bowed).toBe(true);
            expect(this.berserker.bowed).toBe(true);
        });

        it('bows the attached character in a conflict it won', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.disciple, this.initiate],
                defenders: [this.whisperer]
            });
            this.noMoreActions();

            this.player1.clickPrompt('No');
            this.player1.clickPrompt('Gain 2 Honor');
            expect(this.getChatLogs(5)).toContain('player1 won a military conflict 3 vs 0');
            expect(this.disciple.bowed).toBe(true);
            expect(this.initiate.bowed).toBe(true);
        });
    });
});
