describe('Eagle\'s Rest Peak', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['aggressive-moto'],
                    hand: ['i-can-swim', 'way-of-the-scorpion']
                },
                player2: {
                    inPlay: ['togashi-initiate', 'togashi-yokuni', 'doomed-shugenja'],
                    provinces: ['eagle-s-rest-peak']
                }
            });

            this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');
            this.swim = this.player1.findCardByName('i-can-swim');
            this.scorpion = this.player1.findCardByName('way-of-the-scorpion');

            this.initiate = this.player2.findCardByName('togashi-initiate');
            this.yokuni = this.player2.findCardByName('togashi-yokuni');
            this.doomed = this.player2.findCardByName('doomed-shugenja');

            this.eaglesRestPeak = this.player2.findCardByName('eagle-s-rest-peak', 'province 1');
        });

        it('reveals random cards from opponent\'s hand', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.aggressiveMoto],
                defenders: [this.yokuni, this.initiate],
                province: this.eaglesRestPeak
            });

            this.player2.clickCard(this.eaglesRestPeak);
            expect(this.player2).toBeAbleToSelect(this.yokuni);
            expect(this.player2).toBeAbleToSelect(this.initiate);
            expect(this.player2).not.toBeAbleToSelect(this.doomed);
            expect(this.player2).not.toBeAbleToSelect(this.aggressiveMoto);

            this.player2.clickCard(this.yokuni);
            expect(this.getChatLogs(10)).toContain(
                'player2 uses Eagle\'s Rest Peak to use the insight of Togashi Yokuni, revealing and setting aside 2 cards from player1\'s hand'
            );
            expect(this.getChatLogs(10)).toContain(jasmine.stringMatching(/^player1 reveals (I Can Swim and Way of the Scorpion|Way of the Scorpion and I Can Swim)$/));
        });

        it('sets X random cards aside, faceup and out of play', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.aggressiveMoto],
                defenders: [this.yokuni, this.initiate],
                province: this.eaglesRestPeak
            });

            this.player2.clickCard(this.eaglesRestPeak);
            this.player2.clickCard(this.initiate);
            expect(this.getChatLogs(10)).toContain(
                'player2 uses Eagle\'s Rest Peak to use the insight of Togashi Initiate, revealing and setting aside 1 card from player1\'s hand'
            );
            expect(this.player1.hand.length).toBe(1);
            const setAside = [this.swim, this.scorpion].filter((card) => card.location === 'removed from game');
            expect(setAside.length).toBe(1);
            expect(setAside[0].facedown).toBe(false);
        });

        it('sets aside no more cards than the hand holds', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.aggressiveMoto],
                defenders: [this.yokuni, this.initiate],
                province: this.eaglesRestPeak
            });

            this.player2.clickCard(this.eaglesRestPeak);
            this.player2.clickCard(this.yokuni);
            expect(this.getChatLogs(10)).toContain(
                'player2 uses Eagle\'s Rest Peak to use the insight of Togashi Yokuni, revealing and setting aside 2 cards from player1\'s hand'
            );
            expect(this.player1.hand.length).toBe(0);
            expect(this.swim.location).toBe('removed from game');
            expect(this.scorpion.location).toBe('removed from game');
        });

        it('returns the set aside cards to their owner\'s hand when the conflict ends', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.aggressiveMoto],
                defenders: [this.yokuni, this.initiate],
                province: this.eaglesRestPeak
            });

            this.player2.clickCard(this.eaglesRestPeak);
            this.player2.clickCard(this.yokuni);
            expect(this.player1.hand.length).toBe(0);

            this.noMoreActions();
            expect(this.getChatLogs(10)).toContain('player2 won a military conflict 6 vs 3');
            expect(this.getChatLogs(10)).toContain('player1 picks back their cards');
            expect(this.player1.hand.length).toBe(2);
            expect(this.swim.location).toBe('hand');
            expect(this.scorpion.location).toBe('hand');
        });

        it('cannot be used when the opponent has no cards in hand', function () {
            this.player1.moveCard(this.swim, 'conflict discard pile');
            this.player1.moveCard(this.scorpion, 'conflict discard pile');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.aggressiveMoto],
                defenders: [this.yokuni, this.initiate],
                province: this.eaglesRestPeak
            });

            this.player2.clickCard(this.eaglesRestPeak);
            expect(this.player2).not.toHavePrompt('Choose a character to lead the investigation');
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.player1.hand.length).toBe(0);
        });
    });
});
