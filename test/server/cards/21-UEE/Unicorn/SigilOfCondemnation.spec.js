describe('Sigil of Condemnation', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['border-rider', 'iuchi-wayfinder', 'shinjo-outrider'],
                    hand: ['sigil-of-condemnation']
                },
                player2: {
                    inPlay: ['matsu-berserker', 'doji-gift-giver']
                }
            });
            this.borderRider = this.player1.findCardByName('border-rider');
            this.iuchiWayfinder = this.player1.findCardByName('iuchi-wayfinder');
            this.shinjoOutrider = this.player1.findCardByName('shinjo-outrider');
            this.matsuBerserker = this.player2.findCardByName('matsu-berserker');
            this.dojiGiftGiver = this.player2.findCardByName('doji-gift-giver');
            this.sigil = this.player1.findCardByName('sigil-of-condemnation');
        });

        it('removes 1 fate from attached character when outnumbered in military conflict', function () {
            this.player1.playAttachment(this.sigil, this.matsuBerserker);
            this.matsuBerserker.fate = 2;
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.borderRider, this.iuchiWayfinder, this.shinjoOutrider],
                defenders: [this.matsuBerserker]
            });
            this.player2.pass();
            this.player1.clickCard(this.sigil);
            expect(this.matsuBerserker.fate).toBe(1);
            expect(this.matsuBerserker.location).toBe('play area');
        });

        it('discards attached character when it has 0 fate', function () {
            this.player1.playAttachment(this.sigil, this.matsuBerserker);
            this.matsuBerserker.fate = 0;
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.borderRider, this.iuchiWayfinder, this.shinjoOutrider],
                defenders: [this.matsuBerserker]
            });
            this.player2.pass();
            this.player1.clickCard(this.sigil);
            expect(this.matsuBerserker.location).toBe('dynasty discard pile');
        });

        it('does not trigger when attached character is not outnumbered', function () {
            this.player1.playAttachment(this.sigil, this.matsuBerserker);
            this.matsuBerserker.fate = 2;
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.borderRider],
                defenders: [this.matsuBerserker]
            });
            this.player2.pass();
            this.player1.clickCard(this.sigil);
            expect(this.matsuBerserker.fate).toBe(2);
            expect(this.matsuBerserker.location).toBe('play area');
        });

        it('does not trigger in political conflict', function () {
            this.player1.playAttachment(this.sigil, this.dojiGiftGiver);
            this.dojiGiftGiver.fate = 2;
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.borderRider, this.iuchiWayfinder, this.shinjoOutrider],
                defenders: [this.dojiGiftGiver]
            });
            this.player2.pass();
            this.player1.clickCard(this.sigil);
            expect(this.dojiGiftGiver.fate).toBe(2);
            expect(this.dojiGiftGiver.location).toBe('play area');
        });

        it('does not trigger when attached character is not participating', function () {
            this.player1.playAttachment(this.sigil, this.matsuBerserker);
            this.matsuBerserker.fate = 2;
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.borderRider, this.iuchiWayfinder, this.shinjoOutrider],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.sigil);
            expect(this.matsuBerserker.fate).toBe(2);
            expect(this.matsuBerserker.location).toBe('play area');
        });
    });
});
