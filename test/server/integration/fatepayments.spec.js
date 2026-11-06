describe('Fate payments', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 10,
                    inPlay: ['black-marketeer', 'doji-challenger', 'student-of-esoterica'],
                    hand: ['arbiter-of-authority', 'naginata']
                },
                player2: {
                    fate: 5,
                    conflictDiscard: ['naginata', 'blessed-by-fukurokujin']
                }
            });
            this.marketeer = this.player1.findCardByName('black-marketeer');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.student = this.player1.findCardByName('student-of-esoterica');
            this.arbiter = this.player1.findCardByName('arbiter-of-authority');
            this.naginata = this.player1.findCardByName('naginata');
            this.opponentsNaginata = this.player2.findCardByName('naginata');
            this.blessed = this.player2.findCardByName('blessed-by-fukurokujin');
            spyOn(this.game, 'addAnimation').and.callThrough();
        });

        it('shows the cost and the extra fate of a character as one change', function () {
            this.game.clearAnimations();
            this.player1.clickCard(this.arbiter);
            this.player1.clickPrompt('1');

            expect(this.player1.fate).toBe(7);
            expect(this.game.pendingAnimations).toEqual([{ type: 'fate', playerName: 'player1', amount: -3 }]);
        });

        it('shows the cost of an attachment', function () {
            this.player1.playAttachment(this.naginata, this.challenger);

            expect(this.player1.fate).toBe(9);
            expect(this.game.addAnimation).toHaveBeenCalledWith({ type: 'fate', playerName: 'player1', amount: -1 });
        });

        it('shows a cost paid to the opponent on both sides', function () {
            this.player1.clickCard(this.marketeer);
            this.player1.clickCard(this.opponentsNaginata);
            this.player1.clickCard(this.challenger);

            expect(this.player1.fate).toBe(9);
            expect(this.player2.fate).toBe(6);
            expect(this.game.addAnimation).toHaveBeenCalledWith({ type: 'fate', playerName: 'player1', amount: -1 });
            expect(this.game.addAnimation).toHaveBeenCalledWith({ type: 'fate', playerName: 'player2', amount: 1 });
        });

        it('takes fate from an alternate pool once when the cost goes to the opponent', function () {
            this.student.fate = 2;
            this.player1.clickCard(this.marketeer);
            this.player1.clickCard(this.blessed);
            this.player1.clickCard(this.challenger);
            expect(this.player1).toHavePrompt('Choose a card to help pay the fate cost of Blessed by Fukurokujin');
            this.player1.clickCard(this.student);
            this.player1.clickPrompt('1');

            expect(this.student.fate).toBe(1);
            expect(this.player1.fate).toBe(10);
            expect(this.player2.fate).toBe(5);
            expect(this.getChatLogs(10).filter((line) => line.includes('takes 1 fate from Student of Esoterica')).length).toBe(1);
        });
    });
});
