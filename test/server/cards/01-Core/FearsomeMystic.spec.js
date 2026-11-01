describe('Fearsome Mystic', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['fearsome-mystic', { card: 'brash-samurai', fate: 1 }, 'doji-hotaru']
                },
                player2: {
                    inPlay: [
                        { card: 'steward-of-law', fate: 1 },
                        { card: 'doji-whisperer', fate: 1 },
                        { card: 'kakita-asami', fate: 1 },
                        { card: 'kakita-yoshi', fate: 1 },
                        { card: 'brash-samurai', fate: 1 }
                    ]
                }
            });
            this.mystic = this.player1.findCardByName('fearsome-mystic');
            this.myBrash = this.player1.findCardByName('brash-samurai');
            this.hotaru = this.player1.findCardByName('doji-hotaru');
            this.steward = this.player2.findCardByName('steward-of-law');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.asami = this.player2.findCardByName('kakita-asami');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.theirBrash = this.player2.findCardByName('brash-samurai');
            this.noMoreActions();
        });

        it('gets +2 glory during an Air conflict', function() {
            expect(this.mystic.glory).toBe(1);
            this.initiateConflict({
                type: 'political',
                ring: 'air',
                attackers: [this.mystic],
                defenders: [this.whisperer]
            });
            expect(this.mystic.glory).toBe(3);
        });

        it('does not get +2 glory during a conflict of another element', function() {
            this.initiateConflict({
                type: 'political',
                ring: 'fire',
                attackers: [this.mystic],
                defenders: [this.whisperer]
            });
            expect(this.game.currentConflict.ring).toBe(this.game.rings.fire);
            expect(this.mystic.glory).toBe(1);
        });

        it('keeps the +2 glory after the Air ring is claimed, until the conflict ends (ruling #289)', function() {
            this.initiateConflict({
                type: 'political',
                ring: 'air',
                attackers: [this.mystic, this.hotaru],
                defenders: []
            });
            this.noMoreActions();
            this.player1.clickPrompt('No');
            this.player1.clickPrompt('Gain 2 honor');
            expect(this.game.rings.air.claimed).toBe(true);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.hotaru);
            expect(this.mystic.glory).toBe(3);
            this.player1.clickPrompt('Pass');
            expect(this.game.currentConflict).toBe(null);
            expect(this.mystic.glory).toBe(1);
        });

        it('removes 1 fate from each participating opposing character with lower glory', function() {
            this.initiateConflict({
                type: 'political',
                ring: 'air',
                attackers: [this.mystic, this.myBrash],
                defenders: [this.steward, this.whisperer, this.asami, this.yoshi]
            });
            this.player2.pass();
            this.player1.clickCard(this.mystic);
            expect(this.steward.fate).toBe(0);
            expect(this.whisperer.fate).toBe(0);
            expect(this.asami.fate).toBe(0);
            expect(this.yoshi.fate).toBe(1);
            expect(this.theirBrash.fate).toBe(1);
            expect(this.myBrash.fate).toBe(1);
        });

        it('does not remove fate from a character with equal glory', function() {
            this.initiateConflict({
                type: 'political',
                ring: 'fire',
                attackers: [this.mystic],
                defenders: [this.steward, this.whisperer, this.asami]
            });
            this.player2.pass();
            this.player1.clickCard(this.mystic);
            expect(this.steward.fate).toBe(0);
            expect(this.whisperer.fate).toBe(1);
            expect(this.asami.fate).toBe(1);
        });

        it('cannot be used while it is not participating', function() {
            this.initiateConflict({
                type: 'political',
                ring: 'air',
                attackers: [this.myBrash],
                defenders: [this.steward]
            });
            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.mystic);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.steward.fate).toBe(1);
        });
    });
});
