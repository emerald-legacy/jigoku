describe('Shinjo Altansarnai', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shinjo-altansarnai', 'akodo-toturi'],
                    hand: ['raze-to-the-ground'],
                    provinces: ['manicured-garden']
                },
                player2: {
                    inPlay: ['mirumoto-raitsugu', 'doji-whisperer'],
                    provinces: ['entrenched-position']
                }
            });
            this.shinjo = this.player1.findCardByName('shinjo-altansarnai');
            this.garden = this.player1.findCardByName('manicured-garden');
            this.garden.facedown = false;
            this.raitsugu = this.player2.findCardByName('mirumoto-raitsugu');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.entrenched = this.player2.findCardByName('entrenched-position');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.entrenched,
                attackers: [this.shinjo, 'akodo-toturi'],
                defenders: [this.raitsugu]
            });
            this.noMoreActions();
        });

        it('reacts to the province you broke, not to your own province your opponent broke', function() {
            this.player1.clickCard('raze-to-the-ground');
            this.player1.clickCard(this.shinjo);
            this.player1.clickCard(this.garden);
            expect(this.player2).toHavePrompt('Break Manicured Garden');
            this.player2.clickPrompt('No');
            expect(this.player1).toHavePrompt('Break Entrenched Position');
            this.player1.clickPrompt('No');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.shinjo);
            this.player2.clickCard(this.whisperer);
            expect(this.whisperer.location).toBe('dynasty discard pile');
        });
    });
});

describe('Shinjo Altansarnai on the other side', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['akodo-toturi', 'matsu-berserker'],
                    dynastyDiscard: ['shinjo-altansarnai'],
                    hand: ['join-the-fray']
                },
                player2: {
                    inPlay: ['doji-whisperer']
                }
            });
            this.shinjo = this.player1.placeCardInProvince('shinjo-altansarnai', 'province 1');
            this.shinjo.facedown = false;
            this.whisperer = this.player2.findCardByName('doji-whisperer');
        });

        it('reacts while participating, though not attacking', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: ['akodo-toturi', 'matsu-berserker'],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard('join-the-fray');
            this.player1.clickCard(this.shinjo);
            this.player1.clickPrompt('player2');
            expect(this.shinjo.isParticipating()).toBe(true);
            expect(this.shinjo.isAttacking()).toBe(false);
            this.noMoreActions();
            this.player1.clickPrompt('No');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.shinjo);
            this.player2.clickCard(this.whisperer);
            expect(this.whisperer.location).toBe('dynasty discard pile');
        });
    });
});
