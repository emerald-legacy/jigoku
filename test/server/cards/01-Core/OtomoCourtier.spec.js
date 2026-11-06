describe('Otomo Courtier', function() {
    integration(function() {
        describe('Otomo Courtier\'s attack restriction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['otomo-courtier', 'doji-whisperer']
                    },
                    player2: {
                        inPlay: ['valiant-oathkeeper']
                    }
                });
                this.otomo = this.player1.findCardByName('otomo-courtier');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.noMoreActions();
            });

            it('cannot be declared as an attacker against a player with the Imperial Favor', function() {
                this.player2.player.imperialFavor = 'political';
                this.player1.clickRing('earth');
                expect(this.game.currentConflict.conflictType).toBe('political');
                this.player1.clickCard(this.otomo);
                this.player1.clickCard(this.whisperer);
                expect(this.otomo.inConflict).toBe(false);
                expect(this.whisperer.inConflict).toBe(true);
            });

            it('can be declared as an attacker when its controller has the Imperial Favor', function() {
                this.player1.player.imperialFavor = 'political';
                this.player1.clickRing('earth');
                expect(this.game.currentConflict.conflictType).toBe('political');
                this.player1.clickCard(this.otomo);
                expect(this.otomo.inConflict).toBe(true);
            });
        });

        describe('Otomo Courtier ending up attacking a player with the Imperial Favor', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        faction: 'scorpion',
                        fate: 10,
                        honor: 10,
                        inPlay: ['doji-whisperer'],
                        hand: ['blackmail']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['otomo-courtier']
                    }
                });
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.otomo = this.player2.findCardByName('otomo-courtier');
                this.player2.player.imperialFavor = 'political';
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.whisperer],
                    defenders: [this.otomo]
                });
            });

            it('goes home bowed (ruling #178)', function() {
                expect(this.otomo.isDefending()).toBe(true);
                this.player2.pass();
                this.player1.clickCard('blackmail');
                this.player1.clickCard(this.otomo);
                expect(this.otomo.controller).toBe(this.player1.player);
                expect(this.otomo.isParticipating()).toBe(false);
                expect(this.otomo.bowed).toBe(true);
                expect(this.game.currentConflict.attackers).not.toContain(this.otomo);
                expect(this.getChatLogs(5)).toContain('Otomo Courtier cannot participate in the conflict any more and is sent home bowed');
            });
        });
    });
});
