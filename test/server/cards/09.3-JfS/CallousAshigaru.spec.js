

describe('Callous Ashigaru when Raze to the Ground breaks its player\'s own province', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger', 'akodo-toturi'],
                    hand: ['raze-to-the-ground', 'callous-ashigaru'],
                    provinces: ['manicured-garden']
                },
                player2: {
                    inPlay: ['mirumoto-raitsugu'],
                    provinces: ['entrenched-position']
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.toturi = this.player1.findCardByName('akodo-toturi');
            this.callousAshigaru = this.player1.findCardByName('callous-ashigaru');
            this.garden = this.player1.findCardByName('manicured-garden');
            this.garden.facedown = false;
            this.player1.playAttachment(this.callousAshigaru, this.toturi);
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.player2.findCardByName('entrenched-position'),
                attackers: [this.challenger, this.toturi],
                defenders: ['mirumoto-raitsugu']
            });
            this.noMoreActions();
            this.player1.clickCard('raze-to-the-ground');
            this.player1.clickCard(this.challenger);
            this.player1.clickCard(this.garden);
        });

        it('reacts only to the province its player broke', function() {
            expect(this.player2).toHavePrompt('Break Manicured Garden');
            this.player2.clickPrompt('No');
            expect(this.player1).toHavePrompt('Break Entrenched Position');
            this.player1.clickPrompt('No');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.callousAshigaru);
        });

        it('discards each card from each of the opponent\'s provinces', function() {
            const provinces = ['province 1', 'province 2', 'province 3', 'province 4'];
            this.opponentCards = provinces.flatMap((location) => this.player2.player.getDynastyCardsInProvince(location));
            this.ownCards = provinces.flatMap((location) => this.player1.player.getDynastyCardsInProvince(location));
            expect(this.opponentCards.length).toBe(4);
            this.player2.clickPrompt('No');
            this.player1.clickPrompt('No');
            this.player1.clickCard(this.callousAshigaru);
            expect(this.getChatLogs(5)).toContain('player1 uses Callous Ashigaru to discard Adept of the Waves, Adept of the Waves, Adept of the Waves and Adept of the Waves');
            for(const card of this.opponentCards) {
                expect(card.location).toBe('dynasty discard pile');
            }
            for(const card of this.ownCards) {
                expect(card.location).not.toBe('dynasty discard pile');
            }
        });
    });
});

describe('Callous Ashigaru outside a military conflict it attacks in', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger', 'akodo-toturi'],
                    hand: ['callous-ashigaru']
                },
                player2: {
                    inPlay: []
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.toturi = this.player1.findCardByName('akodo-toturi');
            this.callousAshigaru = this.player1.findCardByName('callous-ashigaru');
            this.player1.playAttachment(this.callousAshigaru, this.toturi);
            this.opponentCards = ['province 1', 'province 2', 'province 3', 'province 4'].flatMap((location) => this.player2.player.getDynastyCardsInProvince(location));
            this.noMoreActions();
        });

        it('should trigger when the attached character attacks in a military conflict', function() {
            this.initiateConflict({
                type: 'military',
                attackers: [this.toturi],
                defenders: []
            });
            this.noMoreActions();
            expect(this.player1).toHavePrompt('Break Shameful Display');
            this.player1.clickPrompt('No');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.callousAshigaru);
        });

        it('should not trigger after breaking a province in a political conflict', function() {
            this.initiateConflict({
                type: 'political',
                attackers: [this.toturi],
                defenders: []
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 won a political conflict 4 vs 0');
            expect(this.player1).toHavePrompt('Break Shameful Display');
            this.player1.clickPrompt('No');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.opponentCards.length).toBe(4);
            for(const card of this.opponentCards) {
                expect(card.location).not.toBe('dynasty discard pile');
            }
        });

        it('should not trigger when the attached character is not attacking', function() {
            this.initiateConflict({
                type: 'military',
                attackers: [this.challenger],
                defenders: []
            });
            this.noMoreActions();
            expect(this.toturi.isParticipating()).toBe(false);
            expect(this.getChatLogs(5)).toContain('player1 won a military conflict 3 vs 0');
            expect(this.player1).toHavePrompt('Break Shameful Display');
            this.player1.clickPrompt('No');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            for(const card of this.opponentCards) {
                expect(card.location).not.toBe('dynasty discard pile');
            }
        });
    });
});
