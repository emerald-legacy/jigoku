describe('Assassination', function () {
    integration(function () {
        describe('Assassination', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-initiate', 'mirumoto-raitsugu'],
                        hand: ['assassination']
                    },
                    player2: {
                        inPlay: ['keeper-initiate', 'miya-mystic']
                    }
                });
                this.togashiInitiate = this.player1.findCardByName('togashi-initiate');
                this.mirumotoRaitsugu = this.player1.findCardByName('mirumoto-raitsugu');
                this.assassination = this.player1.findCardByName('assassination');
                this.keeperInitiate = this.player2.findCardByName('keeper-initiate');
                this.miyaMystic = this.player2.findCardByName('miya-mystic');
            });

            it('should be able to target a character with cost 2 or lower', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.togashiInitiate],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.assassination);
                expect(this.player1).toHavePrompt('Assassination');
                expect(this.player1).toBeAbleToSelect(this.togashiInitiate);
                expect(this.player1).not.toBeAbleToSelect(this.mirumotoRaitsugu);
                expect(this.player1).toBeAbleToSelect(this.keeperInitiate);
                expect(this.player1).toBeAbleToSelect(this.miyaMystic);
            });

            it('should cost 3 honor discard the target', function () {
                const honor = this.player1.player.honor;
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.togashiInitiate],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.assassination);
                expect(this.player1).toHavePrompt('Assassination');
                this.player1.clickCard(this.miyaMystic);
                expect(this.miyaMystic.location).toBe('dynasty discard pile');
                expect(this.player1.player.honor).toBe(honor - 3);
            });

            it('should not be playable outside a conflict', function () {
                this.player1.clickCard(this.assassination);
                expect(this.player1).not.toHavePrompt('Assassination');
            });
        });

        describe('a dash cost', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-initiate'],
                        hand: ['assassination']
                    },
                    player2: {
                        inPlay: ['illusionary-decoy']
                    }
                });
                this.togashiInitiate = this.player1.findCardByName('togashi-initiate');
                this.assassination = this.player1.findCardByName('assassination');
                this.illusionaryDecoy = this.player2.findCardByName('illusionary-decoy');
            });

            it('counts as 0', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.togashiInitiate],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.assassination);
                expect(this.player1).toHavePrompt('Assassination');
                expect(this.player1).toBeAbleToSelect(this.illusionaryDecoy);
            });
        });
    });
});

describe('Assassination and a copy', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shosuro-actor']
                },
                player2: {
                    inPlay: ['doji-challenger', 'doji-whisperer'],
                    hand: ['assassination']
                }
            });
            this.actor = this.player1.findCardByName('shosuro-actor');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.actor],
                defenders: [this.whisperer]
            });
            this.player2.pass();
            this.player1.clickCard(this.actor);
            this.player1.clickCard(this.challenger);
        });

        it('reads the printed cost of the copied character', function () {
            expect(this.actor.name).toBe('Doji Challenger');
            this.player2.clickCard('assassination');
            expect(this.player2).toBeAbleToSelect(this.whisperer);
            expect(this.player2).not.toBeAbleToSelect(this.actor);
        });
    });
});
