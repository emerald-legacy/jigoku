describe('Shizuka Toshi', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    stronghold: 'shizuka-toshi',
                    inPlay: ['doji-whisperer', 'hida-guardian']
                },
                player2: {
                    inPlay: ['border-rider', 'kakita-asami', 'brash-samurai']
                }
            });
            this.toshi = this.player1.findCardByName('shizuka-toshi');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.guardian = this.player1.findCardByName('hida-guardian');
            this.borderRider = this.player2.findCardByName('border-rider');
            this.asami = this.player2.findCardByName('kakita-asami');
            this.brash = this.player2.findCardByName('brash-samurai');
            this.noMoreActions();
        });

        function declare(type) {
            this.initiateConflict({
                type: type,
                attackers: [this.whisperer, this.guardian],
                defenders: [this.borderRider, this.asami]
            });
            this.player2.pass();
        }

        it('bows itself and a chosen participating character with political skill 2 or lower', function() {
            declare.call(this, 'political');
            this.player1.clickCard(this.toshi);
            expect(this.player1).toHavePrompt('Shizuka Toshi');
            expect(this.player1).toBeAbleToSelect(this.guardian);
            expect(this.player1).toBeAbleToSelect(this.borderRider);
            this.player1.clickCard(this.borderRider);
            expect(this.borderRider.bowed).toBe(true);
            expect(this.toshi.bowed).toBe(true);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('cannot choose a participating character with political skill higher than 2', function() {
            declare.call(this, 'political');
            this.player1.clickCard(this.toshi);
            expect(this.player1).toHavePrompt('Shizuka Toshi');
            expect(this.player1).toBeAbleToSelect(this.borderRider);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.asami);
        });

        it('cannot choose a character that is not participating', function() {
            declare.call(this, 'political');
            this.player1.clickCard(this.toshi);
            expect(this.player1).toHavePrompt('Shizuka Toshi');
            expect(this.player1).toBeAbleToSelect(this.borderRider);
            expect(this.player1).not.toBeAbleToSelect(this.brash);
        });

        it('cannot be used during a military conflict', function() {
            declare.call(this, 'military');
            expect(this.game.currentConflict.conflictType).toBe('military');
            this.player1.clickCard(this.toshi);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.toshi.bowed).toBe(false);
        });

        it('cannot be used while the stronghold is bowed', function() {
            declare.call(this, 'political');
            this.toshi.bow();
            this.player1.clickCard(this.toshi);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.borderRider.bowed).toBe(false);
            expect(this.guardian.bowed).toBe(false);
        });
    });
});
