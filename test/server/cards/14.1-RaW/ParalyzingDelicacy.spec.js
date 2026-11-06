describe('Paralyzing Delicacy', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-agetoki'],
                    hand: ['paralyzing-delicacy']
                },
                player2: {
                    inPlay: ['doji-whisperer', 'daidoji-nerishma'],
                    dynastyDiscard: ['shiba-tsukune', 'shiba-peacemaker', 'forgotten-library', 'asako-tsuki']
                }
            });

            this.agetoki = this.player1.findCardByName('matsu-agetoki');
            this.paralyzingDelicacy = this.player1.findCardByName('paralyzing-delicacy');

            this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
            this.nerishma = this.player2.findCardByName('daidoji-nerishma');
            this.tsukune = this.player2.placeCardInProvince('shiba-tsukune', 'province 1');
            this.peacemaker = this.player2.placeCardInProvince('shiba-peacemaker', 'province 2');
            this.forgottenLibrary = this.player2.placeCardInProvince('forgotten-library', 'province 3');
            this.tsuki = this.player2.placeCardInProvince('asako-tsuki', 'province 4');
            // each controller needs a facedown card for their characters to be legal targets
            this.tsukune.facedown = true;
            this.player1.player.getDynastyCardsInProvince('province 1').forEach((card) => {
                card.facedown = true;
            });
        });

        it('should not trigger outside a conflict', function() {
            this.player1.clickCard(this.paralyzingDelicacy);
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should only target participating characters', function() {
            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.agetoki],
                defenders: [this.nerishma],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.paralyzingDelicacy);

            expect(this.player1).toHavePrompt('Paralyzing Delicacy');
            expect(this.player1).toBeAbleToSelect(this.agetoki);
            expect(this.player1).toBeAbleToSelect(this.nerishma);
            expect(this.player1).not.toBeAbleToSelect(this.dojiWhisperer);
        });

        it('should lower military by the number of facedown cards in provinces on the control side - opponent', function() {
            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.agetoki],
                defenders: [this.nerishma],
                type: 'military'
            });

            this.tsukune.facedown = true;
            this.peacemaker.facedown = true;
            this.forgottenLibrary.facedown = true;
            this.tsuki.facedown = false;
            this.game.checkGameState(true);

            const initialNerishmaSkill = this.nerishma.militarySkill;
            this.player2.pass();
            this.player1.clickCard(this.paralyzingDelicacy);

            expect(this.player1).toHavePrompt('Paralyzing Delicacy');
            expect(this.player1).toBeAbleToSelect(this.agetoki);
            expect(this.player1).toBeAbleToSelect(this.nerishma);
            expect(this.player1).not.toBeAbleToSelect(this.dojiWhisperer);

            this.player1.clickCard(this.nerishma);

            expect(this.nerishma.militarySkill).toBe(initialNerishmaSkill - 3);
            expect(this.getChatLogs(5)).toContain('player1 plays Paralyzing Delicacy to give Daidoji Nerishma -3military');
        });
    });
});

describe('Paralyzing Delicacy - controller without facedown cards in provinces', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-agetoki'],
                    hand: ['paralyzing-delicacy']
                },
                player2: {
                    inPlay: ['daidoji-nerishma']
                }
            });
            this.agetoki = this.player1.findCardByName('matsu-agetoki');
            this.nerishma = this.player2.findCardByName('daidoji-nerishma');
            this.paralyzingDelicacy = this.player1.findCardByName('paralyzing-delicacy');
            const locations = ['province 1', 'province 2', 'province 3', 'province 4', 'stronghold province'];
            for(const location of locations) {
                this.player1.player.getDynastyCardsInProvince(location).forEach((card) => {
                    card.facedown = true;
                });
                this.player2.player.getDynastyCardsInProvince(location).forEach((card) => {
                    card.facedown = false;
                });
            }
            this.game.checkGameState(true);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.agetoki],
                defenders: [this.nerishma],
                type: 'military'
            });
            this.player2.pass();
        });

        // RRG Target: the effect could not affect the target at all
        it('should not be able to choose a character whose controller has no facedown cards in provinces', function() {
            expect(this.player2.player.getDynastyCardsInProvince('province 1').length).not.toBe(0);
            this.player1.clickCard(this.paralyzingDelicacy);
            expect(this.player1).toHavePrompt('Paralyzing Delicacy');
            expect(this.player1).toBeAbleToSelect(this.agetoki);
            expect(this.player1).not.toBeAbleToSelect(this.nerishma);
        });
    });
});
