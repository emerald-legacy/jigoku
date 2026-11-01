describe('Enigmatic Magistrate', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['enigmatic-magistrate', 'illusionary-decoy', 'miya-mystic']
                }
            });
            this.magistrate = this.player1.findCardByName('enigmatic-magistrate');
            this.decoy = this.player1.findCardByName('illusionary-decoy');
            this.mystic = this.player1.findCardByName('miya-mystic');
        });

        it('only counts characters with an odd printed cost, a dash counting as 0', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.magistrate, this.decoy, this.mystic],
                defenders: []
            });
            expect(this.game.currentConflict.attackerSkill).toBe(2);
        });
    });
});

describe('Enigmatic Magistrate with a token', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['enigmatic-magistrate'],
                    dynastyDiscard: ['ashigaru-encampment']
                }
            });
            this.magistrate = this.player1.findCardByName('enigmatic-magistrate');
            this.encampment = this.player1.placeCardInProvince('ashigaru-encampment');
            this.encampment.facedown = false;
        });

        // a token has no printed cost, so it isn't even-costed (rulings #254, #1116)
        it('should let a token count its skill', function () {
            this.player1.clickCard(this.encampment);
            const ashigaru = this.player1.player.cardsInPlay.find((card) => card.name === 'Ashigaru Recruit');
            expect(ashigaru.militarySkill).toBe(1);
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.magistrate, ashigaru],
                defenders: []
            });
            expect(ashigaru.isAttacking()).toBe(true);
            // Magistrate 2 + Ashigaru Recruit 1
            expect(this.game.currentConflict.attackerSkill).toBe(3);
        });
    });
});
