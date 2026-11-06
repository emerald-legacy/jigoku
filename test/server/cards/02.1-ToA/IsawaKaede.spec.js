describe('Isawa Kaede', function() {
    integration(function() {
        describe('Isawa Kaede\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['isawa-kaede', 'shiba-tsukune'],
                        hand: ['seeker-of-knowledge', 'assassination']
                    },
                    player2: {
                        provinces: ['defend-the-wall'],
                        inPlay: ['shinjo-outrider'],
                        hand: ['display-of-power', 'fine-katana']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'fire',
                    province: 'defend-the-wall',
                    attackers: ['isawa-kaede'],
                    defenders: ['shinjo-outrider']
                });
                this.player1.player.optionSettings.orderForcedAbilities = true;
                this.shibaTsukune = this.player1.findCardByName('shiba-tsukune');
                this.shibaTsukune.modifyFate(1);
                this.isawaKaede = this.player1.findCardByName('isawa-kaede');
                this.isawaKaede.modifyFate(1);
            });

            it('should allow Kaede to resolve only the chosen ring if she wins', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Resolve Ring Effect');
                this.player1.clickRing('fire');
                this.player1.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Fire Ring');
                this.player1.clickCard(this.shibaTsukune);
                this.player1.clickPrompt('Honor Shiba Tsukune');
                expect(this.shibaTsukune.isHonored).toBe(true);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should allow Kaede to resolve only the void ring if she wins', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Resolve Ring Effect');
                this.player1.clickRing('void');
                this.player1.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Void Ring');
                this.player1.clickCard(this.shibaTsukune);
                expect(this.shibaTsukune.fate).toBe(0);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should allow Kaede to trigger both rings if she wins', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Resolve Ring Effect');
                this.player1.clickPrompt('Resolve All Elements');
                expect(this.player1).toHavePrompt('Choose an effect to be resolved');
                expect(this.player1.currentButtons).toContain('Fire Ring Effect');
                expect(this.player1.currentButtons).toContain('Void Ring Effect');
            });

            it('should interact correctly with Seeker of Knowledge', function() {
                this.player2.pass();
                this.player1.clickCard('seeker-of-knowledge');
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Conflict');
                this.noMoreActions();
                this.player1.clickPrompt('Resolve All Elements');
                expect(this.player1).toHavePrompt('Choose an effect to be resolved');
                expect(this.player1.currentButtons).toContain('Fire Ring Effect');
                expect(this.player1.currentButtons).toContain('Void Ring Effect');
                expect(this.player1.currentButtons).toContain('Air Ring Effect');
            });

            it('should not allow the defender to resolve multiple rings if Kaede loses', function() {
                this.player2.playAttachment('fine-katana', 'shinjo-outrider');
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                this.player2.clickCard('defend-the-wall');
                expect(this.player2).toHavePrompt('Resolve Ring Effect');
            });

            it('should not permit Kaede to be targeted by the void ring', function() {
                this.player2.playAttachment('fine-katana', 'shinjo-outrider');
                this.noMoreActions();
                this.player2.clickCard('defend-the-wall');
                this.player2.clickRing('void');
                expect(this.player2).toHavePrompt('Void Ring');
                expect(this.player2).toBeAbleToSelect(this.shibaTsukune);
                expect(this.player2).not.toBeAbleToSelect(this.isawaKaede);
            });

            it('should allow the defender to resolve multiple rings when Display of Power is played', function() {
                this.player2.player.optionSettings.orderForcedAbilities = true;
                this.player2.pass();
                this.player1.clickCard('assassination');
                this.player1.clickCard('shinjo-outrider', 'any', 'opponent');
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('display-of-power');
                this.player2.clickCard('display-of-power');
                expect(this.player2).toHavePrompt('Resolve Ring Effect');
                this.player2.clickPrompt('Resolve All Elements');
                expect(this.player2).toHavePrompt('Choose an effect to be resolved');
                expect(this.player2.currentButtons).toContain('Fire Ring Effect');
                expect(this.player2.currentButtons).toContain('Void Ring Effect');
            });
        });
    });
});

describe('Isawa Kaede sent home by False Loyalties', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 12,
                    inPlay: ['isawa-kaede', 'shiba-tsukune'],
                    hand: ['seeker-of-knowledge']
                },
                player2: {
                    honor: 8,
                    hand: ['false-loyalties']
                }
            });
            this.kaede = this.player1.findCardByName('isawa-kaede');
            this.tsukune = this.player1.findCardByName('shiba-tsukune');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                ring: 'fire',
                attackers: [this.kaede],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard('seeker-of-knowledge');
            this.player1.clickPrompt('0');
            this.player1.clickPrompt('Conflict');
            this.noMoreActions();
        });

        it('still resolves each element the ring has left (EmeraldDB ruling)', function() {
            this.player2.clickCard('false-loyalties');
            this.player2.clickCard(this.kaede);
            this.player2.clickCard(this.tsukune);
            expect(this.kaede.inConflict).toBe(false);
            this.player1.clickPrompt('No');
            // Kaede won as an attacker: each element resolves, but the ring has lost her Void
            expect(this.player1).toHavePromptButton('Resolve All Elements');
            expect(this.game.currentConflict.ring.getElements()).not.toContain('void');
        });
    });
});
