pragma solidity ^0.8.9;

contract Token {
  string public name = "My Hardhat Token";
  string public symbol = "MHT";
  uint256 public totalSupply = 1000000;
  address public owner;
  mapping(address => uint256) balances;

  event Transfer(address indexed _from, address indexed _to, uint256 _value);

  constructor() {
    owner = msg.sender;
    balances[owner] = totalSupply;
  }

  function transfer(address _to, uint256 _amount) external {
    require(balances[msg.sender] >= _amount, "Not enough tokens");
    balances[msg.sender] -= _amount;
    balances[_to] += _amount;
    emit Transfer(msg.sender, _to, _amount);
  }

  function balanceOf(address _account) external view returns (uint256) {
    return balances[_account];
  }
}
