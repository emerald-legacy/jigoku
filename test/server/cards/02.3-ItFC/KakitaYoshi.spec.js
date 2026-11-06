describe('Kakita Yoshi', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 10,
                    honor: 10,
                    inPlay: ['kakita-yoshi', 'border-rider'],
                    hand: ['a-fate-worse-than-death', 'assassination', 'mirumoto-s-fury']
                },
                player2: {
                    fate: 10,
                    inPlay: ['brash-samurai', 'doji-whisperer'],
                    hand: ['a-fate-worse-than-death']
                }
            });

            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.rider = this.player1.findCardByName('border-rider');
            this.afwtd = this.player1.findCardByName('a-fate-worse-than-death');
            this.assassination = this.player1.findCardByName('assassination');
            this.fury = this.player1.findCardByName('mirumoto-s-fury');

            this.brash = this.player2.findCardByName('brash-samurai');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.afwtd2 = this.player2.findCardByName('a-fate-worse-than-death');
        });

        describe('while participating', function() {
            beforeEach(function() {
                this.player1.player.imperialFavor = 'political';
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.yoshi],
                    defenders: [this.whisperer]
                });
                this.player2.pass();
            });

            // ruling #158: the discarded favor returns to the unclaimed state
            it('should discard the Imperial Favor to draw 3 cards', function() {
                const handSize = this.player1.hand.length;
                this.player1.clickCard(this.yoshi);
                expect(this.player1.player.imperialFavor).toBe('');
                expect(this.player2.player.imperialFavor).toBe('');
                expect(this.player1.hand.length).toBe(handSize + 3);
                expect(this.getChatLogs(5)).toContain('player1 uses Kakita Yoshi, discarding the Imperial Favor to draw 3 cards, and reduce the cost of events this conflict');
            });

            it('should reduce the cost of each event you play this conflict by 2', function() {
                this.player1.clickCard(this.yoshi);
                this.player2.pass();
                this.player1.clickCard(this.afwtd);
                this.player1.clickCard(this.whisperer);
                expect(this.afwtd.location).toBe('conflict discard pile');
                expect(this.player1.fate).toBe(8);
                this.player2.pass();
                this.player1.clickCard(this.fury);
                this.player1.clickCard(this.yoshi);
                expect(this.fury.location).toBe('conflict discard pile');
                expect(this.player1.fate).toBe(8);
            });

            // ruling #257: only the fate cost is reduced
            it('should not reduce additional costs', function() {
                this.player1.clickCard(this.yoshi);
                this.player2.pass();
                this.player1.clickCard(this.assassination);
                this.player1.clickCard(this.brash);
                expect(this.brash.location).toBe('dynasty discard pile');
                expect(this.player1.honor).toBe(7);
                expect(this.player1.fate).toBe(10);
            });

            it('should not reduce the cost of the opponent\'s events', function() {
                this.player1.clickCard(this.yoshi);
                this.player2.clickCard(this.afwtd2);
                this.player2.clickCard(this.yoshi);
                expect(this.afwtd2.location).toBe('conflict discard pile');
                expect(this.player2.fate).toBe(6);
            });

            it('should stop reducing costs after the conflict', function() {
                this.player1.clickCard(this.yoshi);
                this.noMoreActions();
                expect(this.getChatLogs(10)).toContain('player1 won a political conflict 6 vs 3');
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Don\'t resolve');
                expect(this.game.currentConflict).toBe(null);
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'fire',
                    attackers: [this.brash],
                    defenders: [this.rider]
                });
                this.player1.clickCard(this.fury);
                this.player1.clickCard(this.brash);
                expect(this.fury.location).toBe('conflict discard pile');
                expect(this.player1.fate).toBe(9);
            });
        });

        // ruling #157: the Imperial Favor must be discarded as a cost
        it('should not be usable without the Imperial Favor', function() {
            this.player2.player.imperialFavor = 'political';
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.yoshi],
                defenders: [this.whisperer]
            });
            this.player2.pass();
            const handSize = this.player1.hand.length;
            this.player1.clickCard(this.yoshi);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.player1.hand.length).toBe(handSize);
            expect(this.player2.player.imperialFavor).toBe('political');
        });

        it('should not be usable while not participating', function() {
            this.player1.player.imperialFavor = 'political';
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.rider],
                defenders: [this.whisperer]
            });
            this.player2.pass();
            const handSize = this.player1.hand.length;
            this.player1.clickCard(this.yoshi);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.player1.hand.length).toBe(handSize);
            expect(this.player1.player.imperialFavor).toBe('political');
        });
    });
});
