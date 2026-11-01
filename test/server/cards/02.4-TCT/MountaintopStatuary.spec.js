describe('Mountaintop Statuary', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'setup',
                player1: {
                    dynastyDeck: ['mountaintop-statuary'],
                    hand: ['rebuild'],
                    dynastyDiscard: ['the-imperial-palace']
                }
            });
            this.mountaintopStatuary = this.player1.placeCardInProvince('mountaintop-statuary', 'province 1');
            this.imperialPalace = this.player1.dynastyDiscard[0];
            this.keepDynasty();
            this.keepConflict();
        });

        describe('when flipped during the dynasty phase', function() {
            it('it should prompt the player', function() {
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.mountaintopStatuary);
            });

            it('it should move to the stronghold province when triggered', function() {
                this.player1.clickCard(this.mountaintopStatuary);
                expect(this.mountaintopStatuary.location).toBe('stronghold province');
            });

            it('it should be replaced by a facedown card', function() {
                this.player1.clickCard(this.mountaintopStatuary);
                this.newCard = this.player1.player.getDynastyCardInProvince('province 1');
                expect(this.newCard).toBeDefined();
                expect(this.newCard.facedown).toBe(true);
            });
        });

        describe('when Rebuild is played on Mountaintop Statuary in the stronghold province', function() {
            beforeEach(function() {
                this.player1.clickCard(this.mountaintopStatuary);
                this.rebuild = this.player1.clickCard('rebuild');
            });

            it('it should prompt the player', function() {
                expect(this.mountaintopStatuary.location).toBe('stronghold province');
                expect(this.player1).toHavePrompt('Rebuild');
                expect(this.player1).toBeAbleToSelect(this.mountaintopStatuary);
            });

            it('it should shuffle Mountaintop Statuary and place Imperial Palace in the stronghold province', function() {
                expect(this.player1).toHavePrompt('Rebuild');
                this.player1.clickCard(this.mountaintopStatuary);
                expect(this.player1).toHavePrompt('Rebuild');
                this.player1.clickCard(this.imperialPalace);
                expect(this.mountaintopStatuary.location).toBe('dynasty deck');
                expect(this.imperialPalace.location).toBe('stronghold province');
            });
        });
    });
});

describe('Mountaintop Statuary\'s action', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['border-rider', 'doji-challenger']
                },
                player2: {
                    inPlay: ['moto-youth'],
                    dynastyDiscard: ['mountaintop-statuary']
                }
            });
            this.borderRider = this.player1.findCardByName('border-rider');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.motoYouth = this.player2.findCardByName('moto-youth');
            this.statuary = this.player2.placeCardInProvince('mountaintop-statuary', 'province 1');
            this.statuary.facedown = false;
            this.province1 = this.player2.findCardByName('shameful-display', 'province 1');
            this.province2 = this.player2.findCardByName('shameful-display', 'province 2');
        });

        it('can only choose an attacking character with printed cost 2 or lower', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.province1,
                attackers: [this.borderRider, this.challenger],
                defenders: [this.motoYouth]
            });
            this.player2.clickCard(this.statuary);
            expect(this.player2).toHavePrompt('Mountaintop Statuary');
            expect(this.player2).toBeAbleToSelect(this.borderRider);
            expect(this.player2).not.toBeAbleToSelect(this.challenger);
            expect(this.player2).not.toBeAbleToSelect(this.motoYouth);
        });

        it('sacrifices itself to move the chosen attacking character home', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.province1,
                attackers: [this.borderRider, this.challenger],
                defenders: [this.motoYouth]
            });
            this.player2.clickCard(this.statuary);
            this.player2.clickCard(this.borderRider);
            expect(this.borderRider.isParticipating()).toBe(false);
            expect(this.challenger.isParticipating()).toBe(true);
            expect(this.statuary.location).toBe('dynasty discard pile');
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('cannot be used during a conflict at another province', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.province2,
                attackers: [this.borderRider],
                defenders: [this.motoYouth]
            });
            expect(this.province2.isConflictProvince()).toBe(true);
            this.player2.clickCard(this.statuary);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.statuary.location).toBe('province 1');
            expect(this.borderRider.isParticipating()).toBe(true);
        });
    });
});
